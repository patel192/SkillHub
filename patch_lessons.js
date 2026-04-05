const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/admin/resource/CourseLessons.jsx');
let c = fs.readFileSync(filePath, 'utf8');

// Normalize to LF for processing
let n = c.replace(/\r\n/g, '\n');

// 1. Replace the manual editor div (title input + textarea) with BlockEditor
n = n.replace(
  /value=\{newLesson\.title\}\n(\s+)onChange=\{\(e\) => setNewLesson\(p => \(\{\.\.\.p, title: e\.target\.value\}\)\)\}/g,
  'value={lessonTitle}\n$1onChange={(e) => setLessonTitle(e.target.value)}'
);

// 2. Remove the old content textarea block
n = n.replace(
  /\s*<div className="flex-1 flex flex-col min-h-\[400px\]">\s*<label className="text-\[10px\] font-black uppercase tracking-widest opacity-40 ml-1 mb-2">Content Payload \(Markdown Supported\)<\/label>\s*<textarea \s*value=\{newLesson\.content\}\s*onChange=\{\(e\) => setNewLesson\(p => \(\{\.\.\.p, content: e\.target\.value\}\)\)\}\s*placeholder="Enter curriculum content\/logic\.\.\."\s*className="flex-1 w-full bg-surface2 border border-border p-6 rounded-3xl font-mono text-sm focus:ring-2 focus:ring-brand\/20 outline-none transition-all resize-none"\s*\/>\s*<\/div>/,
  '\n                         <BlockEditor blocks={blocks} setBlocks={setBlocks} />'
);

// 3. Fix scrollbar class
n = n.replace(
  /<div className="flex-1 p-8 space-y-6 overflow-y-auto">\s*<div className="space-y-2">\s*<label className="text-\[10px\] font-black uppercase tracking-widest opacity-40 ml-1">Module Identity<\/label>/,
  (match) => match.replace('overflow-y-auto">', 'overflow-y-auto custom-scrollbar">')
);

// 4. Fix live preview title
n = n.replace(
  '{newLesson.title || "Untitled Module"}',
  '{lessonTitle || "Untitled Module"}'
);

// 5. Fix live preview content
n = n.replace(
  '<RenderedContent content={newLesson.content} onCopy={handleCopy} />',
  '<RenderedContent content={compileBlocks(blocks)} onCopy={handleCopy} />'
);

// Restore CRLF for Windows
n = n.replace(/\n/g, '\r\n');
fs.writeFileSync(filePath, n, 'utf8');
console.log('Patch applied successfully');

// Verify
const verify = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
console.log('newLesson remaining:', (verify.match(/newLesson/g) || []).length);
console.log('lessonTitle found:', verify.includes('lessonTitle'));
console.log('BlockEditor found:', verify.includes('<BlockEditor'));
console.log('compileBlocks preview found:', verify.includes('compileBlocks(blocks)'));
