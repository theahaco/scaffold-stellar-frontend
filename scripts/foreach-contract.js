import { execSync } from 'child_process';
import { join } from 'path';
import { readdirSync } from 'fs';

const contractsDir = join(process.cwd(), 'packages');
const contracts = readdirSync(contractsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const command = process.argv.slice(2).join(' ');

contracts.forEach(contract => {
  const contractDir = join(contractsDir, contract);
  console.log(`Running "${command}" in ${contractDir}`);
  execSync(command, { cwd: contractDir, stdio: 'inherit' });
});
