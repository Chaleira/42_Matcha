import { Component, computed, ref } from 'typecomposer';
import './style.scss'

import { Buffer } from 'buffer'
(window as any).Buffer = Buffer

//import process from 'process'
//(window as any).process = process

//import { HomeView } from './views/home/HomeView'



//function main(t: ComponentType | AsyncComponentLoader) {

//	if (t instanceof Function && t.prototype instanceof Element) {
//		console.log("component: ", t);

//	}
//	else
//		console.log("function: ", t);


//	//}
//}

//main(() => import('./views/home/HomeView.ts'));
//main(HTMLElement);

class FragmentBase extends Component {


	onConnected(): void {
		console.log("connected: ", this);
	}

	static create(f: () => HTMLElement[]): FragmentBase {
		const frag: FragmentBase = new FragmentBase();
		frag.append(...(f() || []));
		frag.isConnected
		return frag
	}
}

function margin() {
	const div = document.createElement('div');
	div.style.margin = "0 auto";
	div.style.width = "100%";
	div.style.height = "100%";
	return div;
}


document.body.innerHTML = "";

class MyDiv extends Component {

	constructor() {
		super();
		this.append(new FragmentBase());
	}

	onConnected(): void {
		console.log("connected: ", this);
	}

	append(...nodes: (Node | string | ref<Node> | ref<Node[]>)[]): void {
		console.log("append: ", nodes);
		for (const node of nodes) {
			if (node instanceof Node) {
				this.appendChild(node);
			}
			else if (node instanceof ref) {
				if (Array.isArray(node.value)) {
					for (const n of node.value) {
						this.appendChild(n);
					}
				}
				else {
					// @ts-ignore
					this.appendChild(node.value);
				}
			}
			else if (typeof node === "string") {
				this.appendChild(document.createTextNode(node));
			}
		}
	}


}


const root = new MyDiv();
root.style.padding = "20px";
document.body.appendChild(root);

const h1start = document.createElement('h2');
h1start.style.color = "yellow";
h1start.innerText = "start";
root.appendChild(h1start);


const g = ref({ p: 10 });


root.append(computed(() => {
	const items: Node[] = []
	for (let i = 1; i <= g.value.p.value; i++) {
		const ha = document.createElement('h2');
		ha.style.color = "red";
		ha.innerText = "H" + i;
		items.push(ha);
	}
	return items;
}))


const h1end = document.createElement('h2');
h1end.style.color = "yellow";
h1end.innerText = "end";
root.appendChild(h1end);


//const f = new DocumentFragment();


//const template = document.createElement('template');
//const p = document.createElement('p');
//p.innerText = "Hello World!";
//template.appendChild(p);

//// Após isso:
const btn = document.createElement('button');
btn.innerText = "Click me!";
btn.onclick = () => {
	//const h1 = document.createElement('h1');
	//h1.innerText = "Hello World! " + Math.random();
	//template.appendChild(h1);
};

root.appendChild(btn);

//div.appendChild(btn);

//div.appendChild(template);
//const content = template.content.cloneNode(true);
//div.appendChild(content);

//// Agora: frag não tem mais filhos
//console.log(template.childNodes.length); // 0