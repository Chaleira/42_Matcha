import { AppPage } from "@/pages/app/AppPage";
import { CanvasElement, Component, VideoElement } from "typecomposer";

export class VideoView extends Component {

	private video = new VideoElement({ className: "webcam", width: "250px", height: "200px", autoplay: true, controls: false, muted: true, borderRadius: "5px", backgroundColor: "black" });
	private video2 = new CanvasElement({ width: "250", height: "200", borderRadius: "5px", backgroundColor: "black" });

	private canvas = new CanvasElement({ width: "250", height: "200", backgroundColor: "black", display: "none" });
	private ctx!: CanvasRenderingContext2D;
	private isRecording: number = 0;
	private streamAudio: MediaStream | null = null;
	private streamVideo: MediaStream | null = null;

	constructor(private chatId: string) {
		super({ display: "flex", flexDirection: "row", gap: "10px", padding: "10px", width: "100%", backgroundColor: "#f0f0f0", borderRadius: "5px", boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.1)" });
		console.log("VideoView", chatId);
		this.append(this.video, this.video2, this.canvas);
		this.ctx = this.canvas.getContext("2d")!;
		this.startWebcam();
		if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus'))
			this.startAudio();
	}

	async startWebcam() {
		this.streamVideo = await navigator.mediaDevices.getUserMedia({ video: true, });
		this.video.srcObject = this.streamVideo;

		this.video.addEventListener('loadedmetadata', () => {
			console.log("Video metadata loaded");
			this.canvas.width = this.video.videoWidth;
			this.canvas.height = this.video.videoHeight;
			this.sendFrames()
		});

		AppPage.socket.on("receive-message-video", (data) => {
			if (data.chat_id === this.chatId) {
				const img = new Image();
				img.onload = () => {
					this.video2.getContext("2d")?.drawImage(img, 0, 0, this.video2.width, this.video2.height);
				};
				img.src = data.data;

			}
		});
	}

	async startAudio() {
		this.streamAudio = await navigator.mediaDevices.getUserMedia({ audio: true });
		const mediaRecorder = new MediaRecorder(this.streamAudio, { mimeType: 'audio/webm;codecs=opus' });

		mediaRecorder.ondataavailable = (event) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64Audio = reader.result;
				AppPage.socket.emit("send-message-audio", { chat_id: this.chatId, data: base64Audio });
			};
			reader.readAsDataURL(event.data);
		};

		AppPage.socket.on("receive-message-audio", (data) => {
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

					const audio = new Audio();
					this.append(audio);
					audio.src = data.data; // data.data é o dataURL
					audio.play().catch((err) => console.error('Erro ao tocar áudio:', err));
				} catch (e) {
					console.error('Erro ao processar áudio recebido:', e);
				}
			}
		})

		mediaRecorder.start(100);
	}

	stopWebcam() {
		if (this.isRecording) {
			clearInterval(this.isRecording);
			this.isRecording = 0;
		}
		if (this.streamAudio) {
			const tracks = this.streamAudio.getTracks();
			tracks.forEach(track => track.stop());
		}
		if (this.streamVideo) {
			const tracks = this.streamVideo.getTracks();
			tracks.forEach(track => track.stop());
		}
		this.video.srcObject = null;
		this.video.src = "";

	}

	private sendFrames() {
		this.isRecording = setInterval(() => {
			if (this.ctx && this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
				this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
				const dataUrl = this.canvas.toDataURL('image/jpeg', 0.5);
				AppPage.socket.emit("send-message-video", { chat_id: this.chatId, data: dataUrl });
			}
		}, 100);
	}

	onDisconnected(): void {
		this.stopWebcam();
	}

}