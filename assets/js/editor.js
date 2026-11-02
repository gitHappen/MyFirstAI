'use strict';
const ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
const draftKey = 'hidden-world-animals-v1';
let editorReady = false;
let editingPhoto = null;
let photoBusy = false;
let photoTask = 0;
function renderTaxonomy() {
 const root = $('#taxonomy-tree'); root.replaceChildren();
 function branch(parent, animals, level) {
  if (level === ranks.length) { animals.forEach(animal => { const button = element('button', animal.commonName, 'tree-animal'); button.type = 'button'; button.addEventListener('click', () => showProfile(animal)); parent.append(button); }); return; }
  const rank = ranks[level]; const groups = new Map();
  animals.forEach(animal => { const name = animal.taxonomy?.[rank]?.trim() || 'Unclassified'; if (!groups.has(name)) groups.set(name, []); groups.get(name).push(animal); });
  [...groups].sort(([a],[b]) => a.localeCompare(b)).forEach(([name, members]) => {
   const details = element('details'); details.open = level === 0;
   const summary = element('summary', `${rank[0].toUpperCase() + rank.slice(1)} · ${name} (${members.length})`); details.append(summary);
   const children = element('div', null, 'tree-children'); branch(children, members, level + 1); details.append(children); parent.append(details);
  });
 }
 branch(root, state.animals, 0);
}
function refreshCollection() {
 for (const [selector, values, label] of [['#group', state.animals.map(a=>a.taxonomicGroup), 'All groups'], ['#habitat', state.animals.flatMap(a=>list(a.habitats)), 'All habitats']]) {
  const select = $(selector), selected = select.value; select.replaceChildren(); const first = element('option', label); first.value = ''; select.append(first);
  [...new Set(values.filter(Boolean))].sort().forEach(value=>{const option=element('option',value);option.value=value;select.append(option);});
  select.value = values.includes(selected) ? selected : '';
 }
 renderAnimals();renderTaxonomy();renderJournal(state.journal);
}
function editorMessage(message) { $('#editor-message').textContent = message; }
function fillEditor() {
 const animal = state.animals.find(a=>a.id === $('#edit-record').value);
 photoTask++; photoBusy = false; editingPhoto = animal?.photoPaths?.[0] || null;
 $('#animal-form').reset();
 for (const key of ['commonName','taxonomicGroup','scientificName','identificationConfidence','status']) $('#edit-'+key).value = animal?.[key] || ({identificationConfidence:'unverified',status:'awaiting-field-notes'}[key] || '');
 for (const key of ['habitats','observedTraits','observedBehaviors','researchQuestions']) $('#edit-'+key).value = list(animal?.[key]).join('\n');
 ranks.forEach(rank=>$('#edit-tax-'+rank).value = animal?.taxonomy?.[rank] || (rank === 'kingdom' ? 'Animalia' : ''));
 $('#edit-sources').value = list(animal?.sources).map(s=>`${s.title || ''} | ${s.url || ''}`).join('\n');
 $('#edit-photo-alt').value = editingPhoto && typeof editingPhoto === 'object' ? editingPhoto.alt || '' : '';
 showPhotoPreview();editorMessage('');
}
function showPhotoPreview() {const box=$('#edit-photo-preview');box.replaceChildren();if(editingPhoto)photo(box,{photoPaths:[editingPhoto]});else box.append(element('p','No photo selected.'));}
function updateRecordOptions(selected) { const select=$('#edit-record');select.replaceChildren();const add=element('option','+ Add a new animal');add.value='';select.append(add);state.animals.forEach(a=>{const o=element('option',a.commonName);o.value=a.id;select.append(o);});select.value=selected || ''; }
function downloadAnimals() { const blob=new Blob([JSON.stringify(state.animals,null,2)+'\n'],{type:'application/json'});const url=URL.createObjectURL(blob);const link=element('a');link.href=url;link.download='animals.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);editorMessage('Downloaded animals.json contains saved draft changes. Replace data/animals.json in your repository and commit it to publish.'); }
function buildEditor() {
 const dialog=element('dialog');dialog.id='editor-dialog';
 const close=element('button','×','close');close.type='button';close.setAttribute('aria-label','Close visual editor');close.addEventListener('click',()=>dialog.close());dialog.append(close,element('p','YOUR COLLECTION, YOUR NOTES','eyebrow'),element('h2','Visual animal editor'));
 dialog.append(element('p','Edit a private draft on this browser. Save the animal, then download animals.json and replace data/animals.json in GitHub to publish. Browser drafts are not backups or changes to the live site.'));
 const chooser=element('label','Choose an animal');const select=element('select');select.id='edit-record';chooser.append(select);dialog.append(chooser);
 const form=element('form');form.id='animal-form';
 function field(key,label,kind='input',parent=form){const wrapper=element('label',label);const input=element(kind);input.id='edit-'+key;input.name=key;if(kind==='textarea')input.rows=3;else if(kind==='input')input.type='text';wrapper.append(input);parent.append(wrapper);return input;}
 field('commonName','Animal name').required=true;field('taxonomicGroup','Broad animal group').required=true;
 field('scientificName','Scientific name (leave blank if unknown)');field('identificationConfidence','Identification confidence').required=true;
 const status=field('status','Record status','select');['awaiting-field-notes','documented','needs-verification'].forEach(value=>{const option=element('option',value);option.value=value;status.append(option);});
 const taxonomy=element('fieldset');taxonomy.append(element('legend','Classification · leave uncertain ranks blank'));ranks.forEach(rank=>field('tax-'+rank,rank[0].toUpperCase()+rank.slice(1),'input',taxonomy));form.append(taxonomy);
 for(const [key,label] of [['habitats','Habitats'],['observedTraits','Observed physical traits'],['observedBehaviors','Observed behaviors'],['researchQuestions','Questions to investigate']])field(key,label+' (one per line)','textarea');
 field('sources','Research sources (one per line: Title | https://source-url)','textarea');
 const upload=field('photo','Replace animal photo');upload.type='file';upload.accept='image/jpeg,image/png,image/webp';const preview=element('div');preview.id='edit-photo-preview';form.append(preview);field('photo-alt','Photo description and credit');
 const remove=element('button','Remove photo');remove.type='button';remove.addEventListener('click',()=>{photoTask++;photoBusy=false;editingPhoto=null;upload.value='';showPhotoPreview();});form.append(remove);
 const save=element('button','Save animal to browser draft','button');save.type='submit';form.append(save);dialog.append(form);
 const message=element('p');message.id='editor-message';message.setAttribute('role','status');dialog.append(message);
 const download=element('button','Download saved animals.json');download.type='button';download.addEventListener('click',downloadAnimals);dialog.append(download);document.body.append(dialog);
 select.addEventListener('change',()=>{if(form.dataset.dirty==='true'&&!confirm('Discard unsaved form changes?')){select.value=form.dataset.record;return;}fillEditor();form.dataset.dirty='false';form.dataset.record=select.value;});
 form.addEventListener('input',()=>form.dataset.dirty='true');
 upload.addEventListener('change',async()=>{const file=upload.files[0];if(!file)return;const task=++photoTask;photoBusy=true;try{if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>15*1024*1024)throw Error('Choose a JPEG, PNG, or WebP photo under 15 MB.');const bitmap=await createImageBitmap(file);const scale=Math.min(1,1200/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();if(task!==photoTask)return;editingPhoto={path:canvas.toDataURL('image/webp',.82),alt:$('#edit-photo-alt').value};showPhotoPreview();editorMessage('Photo ready. Save the animal to keep this change.');}catch(error){if(task===photoTask)editorMessage(error.message);}finally{if(task===photoTask)photoBusy=false;}});
 form.addEventListener('submit',event=>{event.preventDefault();if(photoBusy){editorMessage('Please wait for the photo to finish processing.');return;}const existing=state.animals.find(a=>a.id===select.value);const animal=structuredClone(existing || {id:'animal-'+crypto.randomUUID(),journalEntryIds:[]});
  for(const key of ['commonName','taxonomicGroup','scientificName','identificationConfidence','status'])animal[key]=$('#edit-'+key).value.trim() || null;
  if(!animal.commonName || !animal.taxonomicGroup || !animal.identificationConfidence){editorMessage('Enter a name, group, and identification confidence.');return;}
  for(const key of ['habitats','observedTraits','observedBehaviors','researchQuestions'])animal[key]=$('#edit-'+key).value.split('\n').map(s=>s.trim()).filter(Boolean);
  animal.taxonomy=Object.fromEntries(ranks.map(rank=>[rank,$('#edit-tax-'+rank).value.trim()||null]));
  const sources=$('#edit-sources').value.split('\n').filter(s=>s.trim());animal.sources=[];
  for(const line of sources){const divider=line.indexOf('|');const title=line.slice(0,divider).trim(),url=line.slice(divider+1).trim();if(divider<1||!/^https?:\/\//i.test(url)||!safeLink(url)){editorMessage('Each source needs a title and an HTTP(S) URL separated by |.');return;}animal.sources.push({title,url});}
  animal.photoPaths=editingPhoto?[{path:typeof editingPhoto==='string'?editingPhoto:editingPhoto.path,alt:$('#edit-photo-alt').value.trim()}]:[];
  if(animal.photoPaths.length&&!animal.photoPaths[0].alt){editorMessage('Add a description and credit for the photo.');return;}
  // Preserve additional existing photos and fields that the editor does not expose.
  if(existing)animal.photoPaths.push(...list(existing.photoPaths).slice(1));
  const next=existing?state.animals.map(a=>a.id===animal.id?animal:a):[...state.animals,animal];
  try{localStorage.setItem(draftKey,JSON.stringify(next));}catch{editorMessage('This browser could not save the draft (storage may be full or blocked). Download your existing saved changes before clearing storage; try a smaller photo. This edit has not been applied.');return;}
  state.animals=next;refreshCollection();updateRecordOptions(animal.id);fillEditor();form.dataset.dirty='false';form.dataset.record=animal.id;editorMessage('Saved to this browser draft. Download animals.json to back up and publish your changes.');$('#draft-notice').hidden=false;
 });
 updateRecordOptions(state.animals[0]?.id);fillEditor();form.dataset.record=select.value;
}
function initializeEditor(){if(editorReady)return;editorReady=true;renderTaxonomy();buildEditor();const notice=element('div',null,'collection-note');notice.id='draft-notice';notice.hidden=true;notice.append(element('span','You are previewing a private browser draft. Other visitors still see published files. '));const clear=element('button','Return to published collection');clear.type='button';clear.addEventListener('click',()=>{if(confirm('Discard this browser draft? Download a backup first if you want to keep it.')){try{localStorage.removeItem(draftKey);location.reload();}catch{editorMessage('Browser storage could not be cleared.');}}});notice.append(clear);$('#explorer').prepend(notice);
 try{const raw=localStorage.getItem(draftKey);if(raw){const draft=JSON.parse(raw);if(!Array.isArray(draft)||!draft.length||draft.some(a=>!a.id||!a.commonName||!a.taxonomicGroup)||new Set(draft.map(a=>a.id)).size!==draft.length)throw Error('Invalid draft');state.animals=draft;refreshCollection();updateRecordOptions(draft[0].id);fillEditor();notice.hidden=false;}}catch{editorMessage('A saved draft could not be read. Published records are displayed.');}
}
window.addEventListener('collection-ready',initializeEditor);
if(state.ready)initializeEditor();
$('#open-editor').addEventListener('click',event=>{event.preventDefault();if(editorReady)$('#editor-dialog').showModal();else alert('The collection must finish loading before editing.');});
$('#expand-tree').addEventListener('click',()=>$('#taxonomy-tree').querySelectorAll('details').forEach(d=>d.open=true));
$('#collapse-tree').addEventListener('click',()=>$('#taxonomy-tree').querySelectorAll('details').forEach(d=>d.open=false));
