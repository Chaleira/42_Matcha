

const auto = Symbol("auto");
const DB_KEY = Symbol("DB_KEY");

//const keyStore = new WeakMap<object, IDBValidKey>();

type Timestamp = number;

export abstract class TableStore {

	updatedAt: Timestamp = Date.now();

	constructor(name: string | Symbol = auto, options: IDBObjectStoreParameters = { autoIncrement: true }) {
		if (!this.constructor.prototype?.tableName) {
			this.constructor.prototype.tableName = name === auto ? this.constructor.name : name;
			this.constructor.prototype.options = options;
		}
	}


	public async save(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			const { tableName, db, options } = this.constructor.prototype;
			const store: IDBObjectStore = db.transaction(tableName, "readwrite").objectStore(tableName);
			this.updatedAt = Date.now();
			// @ts-ignore
			const addRequest = options?.keyPath ? store.put(this) : store.put(this, this.getKey());
			addRequest.onsuccess = (e: any) => {
				const key = e.target.result;
				// @ts-ignore
				if (this[DB_KEY] == undefined) {
					Object.defineProperty(this, DB_KEY, {
						value: key,
						writable: false,
						enumerable: false,
						configurable: false,
					});
				}
				this.synchronize();
				resolve(true)
			}
			addRequest.onerror = () => reject(false);
		});
	}


	public static async put<T extends typeof TableStore>(this: T, data: InstanceType<T>): Promise<InstanceType<T> | undefined> {
		return new Promise<InstanceType<T> | undefined>((resolve) => {
			const { tableName, db } = this.prototype.constructor.prototype;
			const store: IDBObjectStore = db.transaction(tableName, "readwrite").objectStore(tableName);
			data.updatedAt = Date.now();
			const addRequest = store.put(data);
			addRequest.onsuccess = (e: any) => {
				const key = e.target.result;
				// @ts-ignore
				const resutl: InstanceType<T> = new this.prototype.constructor();
				Object.assign(resutl, data);
				Object.defineProperty(resutl, DB_KEY, {
					value: key,
					writable: false,
					enumerable: false,
					configurable: false,
				});
				resutl.synchronize();
				resolve(resutl)
			};
			addRequest.onerror = () => resolve(undefined);
		});
	}

	getKey(): IDBValidKey {
		// @ts-ignore
		return this[DB_KEY];
	}


	public static async get<T extends typeof TableStore>(this: T, key: IDBValidKey): Promise<InstanceType<T> | undefined> {
		return new Promise<InstanceType<T> | undefined>((resolve) => {
			const { tableName, db } = this.prototype.constructor.prototype;
			const store: IDBObjectStore = db.transaction(tableName, "readwrite").objectStore(tableName);
			// @ts-ignore
			const getRequest = store.get(key);
			getRequest.onsuccess = (e: any) => {
				const data = e.target.result;
				if (data) {
					console.log("data: ", data)
					// @ts-ignore
					const resutl: InstanceType<T> = new this.prototype.constructor();
					Object.assign(resutl, data);
					Object.defineProperty(resutl, DB_KEY, {
						value: key,
						writable: false,
						enumerable: false,
						configurable: false,
					});
					resolve(resutl)
				}
				else resolve(undefined);
			};
			getRequest.onerror = () => resolve(undefined);
		});
	}

	async synchronize(): Promise<boolean> {
		if (!this.constructor.prototype.db || this.constructor.prototype.db.synchronize == false) {
			return true
		}
		return await this.constructor.prototype.db.synchronizeTableItem(this);
	}

	public static async synchronizeTable(socket: WebSocket) {
		return new Promise<boolean>((resolve) => {
			setTimeout(() => {
				//console.log("synchronizeTable: ", this.prototype.constructor.prototype.tableName, " socket: ", socket);
				resolve(true);
			}, Math.random() * 2000);
		});
	}

	public static async getUnsynced<T extends typeof TableStore>(this: T): Promise<InstanceType<T>[]> {
		return new Promise<InstanceType<T>[]>((resolve) => {
			const { tableName, db } = this.prototype.constructor.prototype;
			const store: IDBObjectStore = db.transaction(tableName, "readwrite").objectStore(tableName);
			const getRequest = store.getAll();
			getRequest.onsuccess = (e: any) => {
				const data = e.target.result;
				if (data) {
					const result: InstanceType<T>[] = [];
					for (const item of data) {
						// @ts-ignore
						const resutl: InstanceType<T> = new this.prototype.constructor();
						Object.assign(resutl, item);
						result.push(resutl);
					}
					resolve(result)
				}
				else resolve([]);
			};
			getRequest.onerror = () => resolve([]);
		});
	}
}

//const socket = new WebSocket("ws://localhost:3000");

//socket.onopen = () => {
//	console.log("✅ Conectado");
//	socket.send("hello");
//};

//socket.onmessage = (e) => {
//	console.log("📨 Resposta:", e.data);
//};

//socket.onclose = () => {
//	console.log("🔌 Conexão encerrada");
//};

export class DataBase {

	static #socket: WebSocket;
	static #socketInit: Promise<boolean>;
	#request!: IDBOpenDBRequest;
	#eventOnce: Function[] = [];
	readonly name: string;
	version?: number;
	isListen: boolean = false;
	tables = new Map<string, any>;
	readonly options: { version: number, synchronize: boolean, debug?: boolean };

	constructor(name: string, options?: { version?: number, synchronize?: boolean, debug?: boolean }) {
		this.name = name;
		this.options = { ...options, synchronize: options?.synchronize || false, version: options?.version || 1 };
		this.version = options?.version;
		if (this.options.synchronize) {
			window.addEventListener("online", () => { this.synchronize() });
		}
	}

	get online() {
		return navigator?.onLine || false;
	}

	get request() {
		if (!this.#request) {
			throw new Error("Database not opened");
		}
		return this.#request;
	}

	listen(onsuccess?: Function) {
		if (this.options.debug) indexedDB.deleteDatabase(this.name);
		this.#request = indexedDB.open(this.name, this.version);
		this.#request.onupgradeneeded = async (e: any) => {
			const db: IDBDatabase = e.target.result;
			for await (const event of this.#eventOnce) {
				event(db);
			}
			this.#eventOnce = [];
		}
		this.#request.onsuccess = (e: any) => { this.#onsuccess(e.target.result); if (onsuccess) onsuccess(); }
	}

	async #onsuccess(db: IDBDatabase) {
		console.log("onsuccess", db);
		// @ts-ignore
		db["synchronize"] = this.options.synchronize;
		// @ts-ignore
		db["synchronizeTableItem"] = this.synchronizeTableItem.bind(this);
		for (const [_, value] of this.tables) {
			value.constructor.prototype.db = db;
		}
		this.isListen = true;
		if (this.options.synchronize) {
			this.synchronize();
			window.addEventListener("online", () => {
				console.log("online");
			});
			window.addEventListener("offline", () => {
				console.log("offline");
			});
		}
	};

	addTable<T extends typeof TableStore>(table: T | any): void {
		table = new table();
		this.tables.set(table.constructor.prototype.tableName, table);
		this.#eventOnce.push((db: IDBDatabase) => {
			const options = table.constructor.prototype.options;
			const name = table.constructor.prototype.tableName;
			if (!db.objectStoreNames.contains(name)) {
				db.createObjectStore(name, options || { keyPath: "id" });
			}
		})
	}

	private async synchronizeTableItem<T extends TableStore>(item: T): Promise<boolean> {
		console.log("synchronizeTableItem: ", item);
		const data: string = JSON.stringify({
			table: item.constructor.prototype.tableName,
			items: [item],
		}) || "";
		DataBase.#socket.send(data);
		return true;
	}

	private async synchronizeTable<T extends TableStore>(table: T): Promise<boolean> {
		// @ts-ignore
		const items = await table.constructor["getUnsynced"]();
		const data: string = JSON.stringify({
			table: table.constructor.prototype.tableName,
			items: items,
		}) || "";
		DataBase.#socket.send(data);
		// @ts-ignore
		return table.constructor["synchronizeTable"](DataBase.#socket);
	}

	async synchronize(): Promise<boolean> {
		console.log("synchronize: ", this.tables);
		if (DataBase.#socketInit == undefined && DataBase.#socket == undefined) {
			DataBase.#socketInit = new Promise<boolean>((resolve) => {
				DataBase.#socket = new WebSocket("ws://localhost:3000");
				DataBase.#socket.onopen = async () => {
					//DataBase.#socket.send("hello");
					const promises: Promise<boolean>[] = Array.from(this.tables.values()).map((table: any) => this.synchronizeTable(table));
					resolve(await Promise.all(promises).then(() => true).catch(() => false));
				};

				DataBase.#socket.onmessage = (e) => {
					console.log(e.data);
				};

				DataBase.#socket.onclose = () => {
					console.log("🔌 Conexão encerrada");
					resolve(false);
				};

			});
			return await DataBase.#socketInit;
		}
		else {
			const promises: Promise<boolean>[] = Array.from(this.tables.values()).map((table: any) => this.synchronizeTable(table));
			return Promise.all(promises).then(() => true).catch(() => false);
		}
	}


}