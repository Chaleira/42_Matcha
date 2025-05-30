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

outer: {
	console.log("Antes");
	break outer; // isso "pula" para fora do bloco nomeado
	console.log("Depois"); // nunca será executado
}