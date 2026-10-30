(() => {
'use strict';
const {colors,pairs,triples,presets}=window.CHROMA_DATA;
const get=id=>colors.find(c=>c[0]===id)||colors[0];
const state={ids:['black','red','teal'],shades:['standard','standard','standard'],third:true,emphasis:55};
const el=id=>document.getElementById(id);
const shadeList=['light','standard','dark','muted','neon'];
const toneWords={light:'gentle, approachable, and open',standard:'balanced and direct',dark:'reserved, serious, and controlled',muted:'subtle and understated',neon:'intense, vivid, and attention-grabbing'};
const neon={red:'#FF1744',orange:'#FF6200',green:'#39FF14',lightblue:'#4DD8FF',blue:'#167AFF',teal:'#00F5D4',gold:'#FFD000',yellow:'#FFFF00',pink:'#FF53BA',purple:'#B000FF',lime:'#B4FF00',cyan:'#00EFFF',emerald:'#00E68D',forest:'#15BF60',olive:'#B6ED24',sage:'#B4E99F',turquoise:'#00FFE2',coral:'#FF5555',peach:'#FFAB66',maroon:'#D62C55',ivory:'#FFFAD6',taupe:'#D9B878',copper:'#FF862A'};
function blend(x,y,f){const vals=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));const a=vals(x),b=vals(y);return '#'+a.map((n,i)=>Math.round(n*(1-f)+b[i]*f).toString(16).padStart(2,'0')).join('');}
function hex(id,s){const h=get(id)[2];return s==='light'?blend(h,'#FFFFFF',.42):s==='dark'?blend(h,'#080808',.42):s==='muted'?blend(h,'#888888',.4):s==='neon'?(neon[id]||h):h;}
function key(xs){return [...xs].sort().join('|');}
function translation(){
 const ids=state.ids.slice(0,state.third?3:2);
 const triple=state.third?triples.find(x=>key(x[0])===key(ids)):null;
 const pair=pairs.find(x=>key(x[0])===key(ids.slice(0,2)));
 const meaning=triple?triple[1]:pair?pair[1]+(state.third?' with '+get(ids[2])[3]:''):get(ids[0])[3].replace(/^./,c=>c.toUpperCase())+' and '+get(ids[1])[3]+(state.third?' with '+get(ids[2])[3]:'');
 const message=triple?triple[2]:pair?pair[2]+(state.third?' I also value '+get(ids[2])[3]+'.':''):'I value '+get(ids[0])[3]+' and '+get(ids[1])[3]+(state.third?', with a focus on '+get(ids[2])[3]:'')+'.';
 const tone=ids.map((id,i)=>state.shades[i]==='standard'?null:get(id)[1]+' feels '+toneWords[state.shades[i]]).filter(Boolean).join('; ')||'Balanced, clear, and direct';
 const p2=state.third?Math.round((100-state.emphasis)*.7):100-state.emphasis;
 const portions=[state.emphasis,p2,...(state.third?[100-state.emphasis-p2]:[])];
 return {ids,meaning,message,tone,portions,kind:triple?'Defined three-color combination':pair?'Defined color pair'+(state.third?' with accent modifier':''):'General symbolic interpretation'};
}
function mk(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function renderControls(){
 const container=el('color-controls');container.replaceChildren();
 for(let i=0;i<(state.third?3:2);i++){
  const field=mk('div','color-field');const lbl=mk('label','field-label',(i+1)+'. '+['Primary','Secondary','Accent'][i]+' color');field.append(lbl);
  const row=mk('div','picker-row');const swatch=mk('div','picker-swatch');swatch.style.background=hex(state.ids[i],state.shades[i]);row.append(swatch);
  const select=mk('select','color-select');select.setAttribute('aria-label',['Primary','Secondary','Accent'][i]+' color');
  for(const c of colors){const o=mk('option','',c[1]+' — '+c[3]);o.value=c[0];select.append(o);}select.value=state.ids[i];
  select.addEventListener('change',()=>{state.ids[i]=select.value;render();});row.append(select);field.append(row);
  const sh=mk('div','shade-tabs');sh.setAttribute('aria-label','Shade of '+get(state.ids[i])[1]);
  for(const s of shadeList){const btn=mk('button','shade-tab'+(s===state.shades[i]?' selected':''),s==='standard'?'Normal':s[0].toUpperCase()+s.slice(1));btn.type='button';btn.setAttribute('aria-pressed',String(s===state.shades[i]));btn.addEventListener('click',()=>{state.shades[i]=s;render();});sh.append(btn);}field.append(sh);container.append(field);
 }
}
function renderResult(){const t=translation();el('meaning').textContent=t.meaning;el('message').textContent='“'+t.message+'”';el('tone').textContent=t.tone+'.';el('match').textContent=t.kind;el('emphasis-value').textContent=state.emphasis+'%';el('shade-caption').textContent=t.ids.length+' colors';
 const bands=el('bands'),legend=el('legend');bands.replaceChildren();legend.replaceChildren();
 t.ids.forEach((id,i)=>{const h=hex(id,state.shades[i]);const band=mk('div','band');band.style.background=h;band.style.flex=String(t.portions[i]);band.title=get(id)[1]+' '+t.portions[i]+'%';bands.append(band);const legendItem=mk('div','legend-item');const dot=mk('span','dot');dot.style.background=h;legendItem.append(dot,mk('span','',get(id)[1]+' '+t.portions[i]+'%'));legend.append(legendItem);});
}
function render(){el('third').checked=state.third;el('emphasis').value=state.emphasis;renderControls();renderResult();}
function loadPreset(p){state.ids=[p[1],p[2],p[3]||'teal'];state.third=Boolean(p[3]);state.shades=['standard','standard','standard'];state.emphasis=55;showView('translator');render();}
function showView(name){for(const section of document.querySelectorAll('.view'))section.classList.toggle('hidden',section.id!==name+'-view');for(const btn of document.querySelectorAll('.nav'))btn.classList.toggle('active',btn.dataset.view===name);el('page-title').textContent={translator:'Color translator',presets:'Message presets',dictionary:'Color dictionary'}[name];el('page-subtitle').textContent={translator:'Build a message from colors, shades, and visual emphasis.',presets:'Start from a meaning, then personalize your colors.',dictionary:'Explore every color and its symbolic association.'}[name];}
function renderPresets(){const target=el('presets');target.replaceChildren();for(const p of presets){const card=mk('button','preset-card');const band=mk('div','preset-band');p.slice(1).filter(Boolean).forEach(id=>{const sw=mk('span');sw.style.background=get(id)[2];band.append(sw);});card.append(band,mk('strong','',p[0]),mk('small','',p.slice(1).filter(Boolean).map(id=>get(id)[1]).join(' + ')));card.addEventListener('click',()=>loadPreset(p));target.append(card);}}
function renderDictionary(filter=''){const target=el('dictionary');target.replaceChildren();for(const c of colors.filter(x=>(x[1]+' '+x[3]).toLowerCase().includes(filter.toLowerCase()))){const item=mk('button','dictionary-card');const square=mk('span','dictionary-swatch');square.style.background=c[2];item.append(square,mk('strong','',c[1]),mk('small','',c[3]));item.addEventListener('click',()=>{state.ids[0]=c[0];showView('translator');render();});target.append(item);}}
for(const btn of document.querySelectorAll('.nav'))btn.addEventListener('click',()=>showView(btn.dataset.view));
el('third').addEventListener('change',e=>{state.third=e.target.checked;render();});
el('emphasis').addEventListener('input',e=>{state.emphasis=Number(e.target.value);renderResult();});
el('swap').addEventListener('click',()=>{[state.ids[0],state.ids[1]]=[state.ids[1],state.ids[0]];[state.shades[0],state.shades[1]]=[state.shades[1],state.shades[0]];render();});
el('reset').addEventListener('click',()=>loadPreset(['Default','black','red','teal']));
el('copy').addEventListener('click',async()=>{const t=translation();const content='CHROMA 5.2\nColors: '+t.ids.map((id,i)=>get(id)[1]+' ('+state.shades[i]+', '+t.portions[i]+'%)').join(' + ')+'\nMeaning: '+t.meaning+'\nMessage: '+t.message+'\nEmotional tone: '+t.tone;try{await navigator.clipboard.writeText(content);el('notice').textContent='Translation copied to clipboard.';}catch{const ta=mk('textarea');ta.value=content;document.body.append(ta);ta.select();const ok=document.execCommand('copy');ta.remove();el('notice').textContent=ok?'Translation copied to clipboard.':'Copy unavailable. Please select the translation manually.';}});
el('search').addEventListener('input',e=>renderDictionary(e.target.value));
renderPresets();renderDictionary();render();
})();
