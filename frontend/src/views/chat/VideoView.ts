import { AppPage } from "@/pages/app/AppPage";
import { Component, VideoElement } from "typecomposer";

export class VideoView extends Component {

	private video = new VideoElement({ className: "webcam", width: "250px", height: "200px", autoplay: true, controls: false, muted: true, borderRadius: "5px", backgroundColor: "black" });
	private video3 = new VideoElement({ className: "webcam", width: "250px", height: "200px", autoplay: true, controls: false, muted: false, borderRadius: "5px", backgroundColor: "black" });

	private isRecording: number = 0;
	private streamAudio: MediaStream | null = null;
	private streamVideo: MediaStream | null = null;
	private mediaRecorder!: MediaRecorder;

	constructor(private chatId: string) {
		super({ display: "flex", flexDirection: "row", gap: "10px", padding: "10px", width: "100%", backgroundColor: "#f0f0f0", borderRadius: "5px", boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.1)" });
		this.append(this.video, this.video3);
		this.startWebcam();
	}

	async startWebcam() {
		this.streamVideo = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
		this.video.srcObject = this.streamVideo;
		// @ts-ignore
		const peer = new SimplePeer({
			initiator: true,
			stream: this.streamVideo,
			trickle: false
		});

		peer.on('signal', (data: any) => {
			AppPage.socket.emit('send-message-video', { chatId: this.chatId, signal: data });
		});

		peer.on('stream', (remoteStream: MediaStream) => {
			this.video3.srcObject = remoteStream;
			this.video3.play();
		});

		AppPage.socket.on('receive-message-video', (data) => {
			if (data.chatId === this.chatId) {
				peer.signal(data.signal);
			}
		});
	}

	async startAudio() {
		this.streamAudio = await navigator.mediaDevices.getUserMedia({ audio: true });
		this.mediaRecorder = new MediaRecorder(this.streamAudio, { mimeType: 'audio/webm;codecs=opus' });
		this.mediaRecorder.ondataavailable = (event) => {
			if (event.data.size > 0) {
				event.data.arrayBuffer().then(arrayBuffer => {
					AppPage.socket.emit("send-message-audio", { chat_id: this.chatId, data: arrayBuffer });
				});
			}
		};

		AppPage.socket.on("receive-message-audio", async (data) => {
			if (data.chat_id === this.chatId) {
				try {
					const chunk: ArrayBuffer = data.data;
					if (chunk.byteLength === 0) return;
					const blob = new Blob([chunk], { type: 'audio/webm; codecs=opus' });
					const audio = new Audio();
					audio.src = URL.createObjectURL(blob);
					audio.play().catch(err => console.error('Erro ao reproduzir:', err));

				} catch (e) {
					console.error('Erro ao processar áudio recebido:', e);
				}
			}
		})

		this.mediaRecorder.start(250);
	}

	stopWebcam() {
		AppPage.socket.off('receive-message-video');
		AppPage.socket.off('receive-message-audio');
		if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
			this.mediaRecorder.stop();
		}

		if (this.streamAudio) {
			this.streamAudio.getTracks().forEach(track => track.stop());
			this.streamAudio = null;
		}

		if (this.streamVideo) {
			this.streamVideo.getTracks().forEach(track => track.stop());
			this.streamVideo = null;
		}

		this.video.srcObject = null;
		this.video.src = "";

		this.video3.srcObject = null;
		this.video3.src = "";

		if (this.isRecording) {
			clearInterval(this.isRecording);
			this.isRecording = 0;
		}
		console.log("Webcam e microfone desligados.");
	}

	onDisconnected(): void { this.stopWebcam(); }

}