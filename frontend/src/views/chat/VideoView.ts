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
		console.log("VideoView", chatId);
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
			console.log("Enviando sinal", data);
			AppPage.socket.emit('send-message-video', { chatId: this.chatId, signal: data });
		});

		peer.on('stream', (remoteStream: MediaStream) => {
			console.log("Stream remoto recebido");
			this.video3.srcObject = remoteStream;
			this.video3.play();
		});

		AppPage.socket.on('receive-message-video', (data) => {
			if (data.chatId === this.chatId) {
				console.log("Recebido sinal remoto", data.signal);
				peer.signal(data.signal);
			}
		});
	}

	async startAudio() {
		this.streamAudio = await navigator.mediaDevices.getUserMedia({ audio: true });
		this.mediaRecorder = new MediaRecorder(this.streamAudio, { mimeType: 'audio/webm;codecs=opus' });
		console.log("MediaRecorder", MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? "supported" : "not supported");
		this.mediaRecorder.ondataavailable = (event) => {
			//const reader = new FileReader();
			//reader.onloadend = () => {
			//	const base64Audio = reader.result;
			//	AppPage.socket.emit("send-message-audio", { chat_id: this.chatId, data: base64Audio });
			//};
			//reader.readAsDataURL(event.data);
			if (event.data.size > 0) {
				event.data.arrayBuffer().then(arrayBuffer => {
					AppPage.socket.emit("send-message-audio", { chat_id: this.chatId, data: arrayBuffer });
				});
			}
		};
		//const audioChunks: Blob[] = [];
		const audioContext = new AudioContext();

		AppPage.socket.on("receive-message-audio", async (data) => {
			if (data.chat_id === this.chatId) {
				try {
					//// data.data é o dataURL: "data:audio/webm;codecs=opus;base64,..."
					//const base64 = data.data.split(',')[1];

					//// Garante que o tipo MIME seja extraído corretamente
					//const mimeMatch = data.data.match(/^data:([^;]+);/);
					//const mime = mimeMatch ? mimeMatch[1] : 'audio/webm';

					//const byteChars = atob(base64);
					//const byteArray = new Uint8Array(byteChars.length);
					//for (let i = 0; i < byteChars.length; i++) {
					//	byteArray[i] = byteChars.charCodeAt(i);
					//}

					//const blob = new Blob([byteArray], { type: mime });
					//const audioUrl = URL.createObjectURL(blob);

					//const audio = new Audio();
					//this.append(audio);
					//audio.src = data.data; // data.data é o dataURL
					//audio.play().catch((err) => console.error('Erro ao tocar áudio:', err));
					const chunk: ArrayBuffer = data.data;
					console.log('Chunk recebido:', chunk.byteLength);

					if (chunk.byteLength === 0) return; // evita blobs vazios
					//try {
					//	const buffer = await audioContext.decodeAudioData(chunk.slice(0)); // slice evita erro de buffer compartilhado
					//	const source = audioContext.createBufferSource();
					//	source.buffer = buffer;
					//	source.connect(audioContext.destination);
					//	source.start();
					//} catch (err) {
					//	console.error('Erro ao decodificar e tocar áudio:', err);
					//}
					//console.log("chunk", chunk);
					const blob = new Blob([chunk], { type: 'audio/webm; codecs=opus' });
					const audio = new Audio();
					audio.src = URL.createObjectURL(blob);
					audio.play().catch(err => console.error('Erro ao reproduzir:', err));
					//this.stopWebcam();
					//const blob = new Blob([chunk], { type: 'audio/webm;codecs=opus' });
					//const audio = new Audio(URL.createObjectURL(blob));
					//audio.play()
				} catch (e) {
					console.error('Erro ao processar áudio recebido:', e);
				}
			}
		})

		this.mediaRecorder.start(250);
	}

	stopWebcam() {
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