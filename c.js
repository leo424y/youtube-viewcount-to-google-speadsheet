const exec = require('child_process').exec;
var yids = ''
const gsheet_id = '1nSMVMCMejKXwt6DTnppIzNIHkqP99V_w6dgZ4IBQo5E'
const gsheet_url = 'http://api.sheetson.com/v1/sheets/1?spreadsheetId=' + gsheet_id
const get_yids = `curl ${gsheet_url} | jq ".results[].yid"`

exec(get_yids,
	(error, stdout, stderr) => {
		yids = stdout.split('\n')
		console.log(`${stdout}`);
		console.log(`${stderr}`);
		if (error !== null) {
			console.log(`exec error: ${error}`);
		}
		console.log(yids);
		for (i = 0; i < yids.length; i++) {
			const my_yid = yids[i].replace(/['"]+/g, '')
			console.log(my_yid)
			get_views(my_yid)
		}
	});

function get_views(yid) {
	exec('python3 o.py ' + yid,
		(error, stdout, stderr) => {
			console.log(stdout)
			const yid = (stdout.trim()).split('+')[0]
			if (yid != "") {
				const views = (stdout.trim()).split('+')[1]
				const res_json = "'" + JSON.stringify({
					yid: yid,
					views: views,
					time: (Date.now() / 1000 | 0)
				}) + "'";
				console.log(res_json)
				write_data(res_json)
			}
		});
}

function write_data(res_json) {
	const run = 'curl "http://api.sheetson.com/v1/sheets/Demo/?spreadsheetId=1E7TqgW5HOzVv-4_hZ0ofzdqUHC879J_iwky5XMN-5Q8" -X POST -H "Content-Type: application/json"  -d ' + res_json
	exec(run,
		(error, stdout, stderr) => {
			console.log(`${stdout}`);
			console.log(`${stderr}`);
			if (error !== null) {
				console.log(`exec error: ${error}`);
			}
		});
}
