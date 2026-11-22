// Tiny stack VM: 32-bit wrap, 256-value stack, 64-deep calls, 256 words of
// memory, 1M steps, 64K output, traps 2..11 with their own exit codes.
// Runs every /input/<id>/program.bin + input.bin, writes /output/<id>/stdout.bin + exit.txt.
const{readdirSync:R,readFileSync:F,writeFileSync:W,mkdirSync:K}=require("node:fs"),{join:J}=require("node:path"),I=process.env.MAKEFUN_INPUT_DIR||"/input",O=process.env.MAKEFUN_OUTPUT_DIR||"/output";
function run(p,g){const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=new Uint8Array(65536);let s=0,t=0,L=0,q=0,pc=0,z=0;const fin=e=>({o:o.slice(0,L),e});
for(;;){if(z===1e6)return fin(10);if(pc<0||pc>=p.length)return fin(9);const k=p[pc];
if(k>7&&!(k>=16&&k<=34)&&!(k>=48&&k<=52)&&!(k>=64&&k<=65)&&!(k>=80&&k<=83))return fin(5);
const im=k===1?1:k===2?4:k>=48&&k<=51?2:0;if(pc+im>=p.length)return fin(9);z++;const nx=pc+1+im;
const two=k>=16&&k<=34&&k!==23&&k!==27,one=k===3||k===4||k===23||k===27||k===49||k===50||k===64||k===80||k===81||k===83,pp=two||k===5||k===6||k===65?2:k===7?3:one?1:0,ps=k===1||k===2||k===82||two||k===23||k===27||k===64?1:k===4||k===5?2:k===6||k===7?3:0;
if(s<pp)return fin(2);if(s-pp+ps>256)return fin(3);pc=nx;
switch(k){case 0:return fin(0);case 1:D[s++]=(p[nx-1]<<24)>>24;break;case 2:D[s++]=p[nx-4]|(p[nx-3]<<8)|(p[nx-2]<<16)|(p[nx-1]<<24);break;case 3:s--;break;case 4:D[s]=D[s-1];s++;break;case 5:{const v=D[s-1];D[s-1]=D[s-2];D[s-2]=v;break}case 6:D[s]=D[s-2];s++;break;case 7:{const v=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=v;break}case 23:D[s-1]=-D[s-1]|0;break;case 27:D[s-1]=~D[s-1];break;
case 48:case 49:case 50:{const rel=((p[nx-2]|(p[nx-1]<<8))<<16)>>16;let tk=1;if(k!==48){const v=D[--s];tk=k===49?v===0:v!==0}if(tk)pc=nx+rel;break}
case 51:if(t===64)return fin(7);C[t++]=nx;pc=p[nx-2]|(p[nx-1]<<8);break;
case 52:if(!t)return fin(8);pc=C[--t];break;
case 64:{const a=D[s-1];if(a<0||a>255)return fin(6);D[s-1]=M[a];break}
case 65:{const a=D[s-1],v=D[s-2];if(a<0||a>255)return fin(6);s-=2;M[a]=v;break}
case 80:{const b=String(D[s-1]);if(L+b.length>65536)return fin(11);s--;for(let i=0;i<b.length;i++)o[L++]=b.charCodeAt(i);break}
case 81:if(L>=65536)return fin(11);o[L++]=D[--s]&255;break;
case 82:D[s++]=q<g.length?g[q++]:-1;break;
case 83:return fin(D[--s]&255);
default:{const B=D[s-1],A=D[s-2];let r;if(k===16)r=(A+B)|0;else if(k===17)r=(A-B)|0;else if(k===18)r=Math.imul(A,B);else if(k===19){if(!B)return fin(4);r=(A/B)|0}else if(k===20){if(!B)return fin(4);r=(A%B)|0}else if(k===21){if(!B)return fin(4);r=Math.floor((A>>>0)/(B>>>0))|0}else if(k===22){if(!B)return fin(4);r=((A>>>0)%(B>>>0))|0}else if(k===24)r=A&B;else if(k===25)r=A|B;else if(k===26)r=A^B;else if(k===28)r=A<<(B&31);else if(k===29)r=A>>(B&31);else if(k===30)r=(A>>>(B&31))|0;else if(k===32)r=A===B?1:0;else if(k===33)r=A<B?1:0;else r=(A>>>0)<(B>>>0)?1:0;s-=2;D[s++]=r;break}}}}
for(const d of R(I).sort()){const r=run(new Uint8Array(F(J(I,d,"program.bin"))),new Uint8Array(F(J(I,d,"input.bin"))));K(J(O,d),{recursive:true});W(J(O,d,"stdout.bin"),r.o);W(J(O,d,"exit.txt"),r.e+"\n")}
