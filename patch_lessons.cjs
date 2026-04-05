const fs = require('fs');
const p = 'src/components/admin/resource/CourseLessons.jsx';
let c = fs.readFileSync(p, 'utf8');

// Fix 1: Replace title input value binding
c = c.replace("value={newLesson.title}", "value={lessonTitle}");
c = c.replace("onChange={(e) => setNewLesson(p => ({...p, title: e.target.value}))}", "onChange={(e) => setLessonTitle(e.target.value)}");

// Fix 2: Remove old textarea content block and insert BlockEditor
const oldTextareaBlock = `                         </div>\r\n                         <div className="flex-1 flex flex-col min-h-[400px]">\r\n                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1 mb-2">Content Payload (Markdown Supported)</label>\r\n                            <textarea \r\n                               value={newLesson.content}\r\n                               onChange={(e) => setNewLesson(p => ({...p, content: e.target.value}))}\r\n                               placeholder="Enter curriculum content/logic..."\r\n                               className="flex-1 w-full bg-surface2 border border-border p-6 rounded-3xl font-mono text-sm focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none"\r\n                            />\r\n                         </div>`;

const newBlockEditor = `                         </div>\r\n                         <BlockEditor blocks={blocks} setBlocks={setBlocks} />`;

if (c.includes(oldTextareaBlock)) {
  c = c.replace(oldTextareaBlock, newBlockEditor);
  console.log('Fix 2: Textarea replaced with BlockEditor');
} else {
  console.log('Fix 2: Textarea block NOT FOUND - checking content...');
  // Try with LF only
  const cLF = c.replace(/\r\n/g, '\n');
  const oldLF = oldTextareaBlock.replace(/\r\n/g, '\n');
  if (cLF.includes(oldLF)) {
    const newLF = newBlockEditor.replace(/\r\n/g, '\n');
    const fixed = cLF.replace(oldLF, newLF).replace(/\n/g, '\r\n');
    c = fixed;
    console.log('Fix 2: Fixed via LF normalization');
  } else {
    console.log('Fix 2: FAILED - not found');
  }
}

// Fix 3: Fix live preview title
c = c.replace('{newLesson.title || "Untitled Module"}', '{lessonTitle || "Untitled Module"}');

// Fix 4: Fix live preview content
c = c.replace('<RenderedContent content={newLesson.content} onCopy={handleCopy} />', '<RenderedContent content={compileBlocks(blocks)} onCopy={handleCopy} />');

fs.writeFileSync(p, c, 'utf8');

// Verify
const v = fs.readFileSync(p, 'utf8');
console.log('newLesson remaining:', (v.match(/newLesson/g)||[]).length);
console.log('lessonTitle found:', v.includes('lessonTitle'));
console.log('BlockEditor usage found:', v.includes('<BlockEditor blocks'));
console.log('compileBlocks preview found:', v.includes('compileBlocks(blocks)'));
