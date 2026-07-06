const fs = require('fs');
const file = 'packages/sdkwork-modelkit-workspace/src/services/WorkspaceService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/const parsed = JSON\.parse\(saved\);/g, 'let parsed = []; try { parsed = JSON.parse(saved); } catch (e) {}');
content = content.replace(/return JSON\.parse\(saved\);/g, 'try { return JSON.parse(saved); } catch (e) { return []; }');

fs.writeFileSync(file, content);
