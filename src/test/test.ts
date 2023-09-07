import * as express from 'express';
import konponent from '../kon';

const app = express();

app.use(express.static('src/test/site'));

const kon = konponent(app, { folderName: 'site', indexName: 'main' });

app.listen(80, () => {
	kon.load();
});