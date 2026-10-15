# Run only on the already authenticated official server, using sudo python3.
import pathlib,json,hashlib,tarfile,datetime,subprocess,os
materials=pathlib.Path('/home/ubuntu/anxinlaw-release-45a74f8-materials')
release=pathlib.Path('/var/www/anxinlaw-release-45a74f8')
config=pathlib.Path('/etc/nginx/sites-available/anxinlaw')
expected='ccb460d395fffe124f5e9c104d7b6428aadc691cc798f16569756922adc10e92'
assert hashlib.sha256((materials/'site.tar.xz').read_bytes()).hexdigest()==expected,'Archive digest mismatch'
manifest=json.loads((materials/'manifest.json').read_text());assert manifest['commit']=='45a74f8b4fbff7275fd01f684d35dcd9e8bacc29'
old=config.read_bytes();needle=b'root /var/www/anxinlaw-release-114c268;';assert old.count(needle)==1,'Current Nginx release differs; stop for inspection'
assert b'server_name anxinlaw.xyz www.anxinlaw.xyz;' in old
stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d-%H%M%S')
backup=pathlib.Path('/home/ubuntu')/('anxinlaw-before-45a74f8-'+stamp)
backup_config=backup.with_suffix('.conf');backup_config.write_bytes(old);backup_config.chmod(0o600)
with tarfile.open(backup.with_suffix('.tgz'),'w:gz') as tar:tar.add('/var/www/anxinlaw-release-114c268',arcname='anxinlaw-release-114c268')
backup.with_suffix('.tgz').chmod(0o600)
assert not release.exists(),'New release directory already exists; do not overwrite'
release.mkdir(mode=0o755)
with tarfile.open(materials/'site.tar.xz','r:xz') as tar:
 members=tar.getmembers()
 for m in members:
  p=pathlib.PurePosixPath(m.name);assert not p.is_absolute() and '..' not in p.parts and m.isfile(),m.name
 tar.extractall(release)
actual={p.relative_to(release).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in release.rglob('*') if p.is_file()}
assert actual==manifest['files'],'Release files differ from manifest'
for p in release.rglob('*'):p.chmod(0o755 if p.is_dir() else 0o644)
patched=old.replace(needle,b'root /var/www/anxinlaw-release-45a74f8;')
config.write_bytes(patched)
try:
 subprocess.run(['nginx','-t'],check=True)
 subprocess.run(['systemctl','reload','nginx'],check=True)
except Exception:
 config.write_bytes(old);subprocess.run(['nginx','-t'],check=True);raise
print(json.dumps({'status':'DEPLOYED','commit':manifest['commit'],'verified_files':len(actual),'release':str(release),'backup':str(backup),'deployed_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}))
