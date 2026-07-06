const fs = require('fs');

const filesToFix = [
  'packages/sdkwork-modelkit-workspace/src/components/common/HeaderUserProfile.tsx',
  'packages/sdkwork-modelkit-workspace/src/components/common/WorkspaceView.tsx',
  'packages/sdkwork-modelkit-workspace/src/components/user/UserProfile.tsx',
  'packages/sdkwork-modelkit-software/src/pages/SoftwarePage.tsx',
  'packages/sdkwork-modelkit-repos/src/pages/ReposPage.tsx'
];

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/text-blue-450/g, 'text-blue-400');
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
