const { Client } = require('ssh2');

const config = {
  host: '31.97.120.64',
  port: 65002,
  username: 'u382928869',
  password: 'Sheikh2024@'
};

const conn = new Client();
conn.on('ready', () => {
  conn.exec(`cd /home/u382928869/domains/cmsportswear.pk/backend && php artisan tinker --execute="\\$p = App\\Models\\Product::find(686); echo json_encode(\\$p ? \\$p->meta_description : 'not found');"`, (err, stream) => {
    if (err) throw err;
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect(config);
