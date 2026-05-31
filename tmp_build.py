import subprocess
from pathlib import Path
root = Path(r'c:\Users\Laptop K1\OneDrive\Desktop\RIPT1307-Nh-m-02-KTHP')
print('cwd', root)
proc = subprocess.run(['npm.cmd', 'run', 'build'], cwd=root, capture_output=True, text=True)
print('returncode', proc.returncode)
print('stdout')
print(proc.stdout)
print('stderr')
print(proc.stderr)
