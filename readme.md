<img src="https://github.com/samuel-baron/Kon/blob/main/images/kon-logo.png" alt=">_Kon! Logo" style="width:200px; height:200px; display: block; margin-left: auto; margin-right: auto;">

# >_Kon!
### A web framework for working with dynamic components!

## What is >_Kon!?

\>_Kon! is a web framework that allows you to create dynamic components that can be used in any web application.

## How do I use >_Kon!?

Here is a simple example of how to use >_Kon!:

```typescript

import * as express from 'express';
import konponent from 'kon';

const app = express();
const folder = 'site'; // here is the main folder

app.use(express.static(folder));

const kon = konponent(app, { folderName: folder, indexName: 'main' }); // indexName is the main html file

app.listen(80, () => {
	kon.load();
});

```

## How do I create a 'konponent'?

Creating a konponent is really straight forward. All you need to do is create a file with .kon.html extension and then you can use it in your html files.

Here is an example of a konponent:

my-konponent.kon.html:

```html

	<h1>this is a konponent!</h1>

```

## How do I use a 'konponent'?

To use a konponent, simply add >_konponent-name to your html file.

main.html

```html

	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>My Konponent</title>
	</head>
	<body>
		>_my-konponent
	</body>
	</html>

```

## Can I use a 'konponent' in another 'konponent'?

Yes! You can use a konponent in another konponent. Here is an example:

my-konponent.kon.html:

```html

	<h1>this is a konponent!</h1>
	>_my-other-konponent

```

my-other-konponent.kon.html:

```html

	<h2>this is another konponent!</h2>

```

## What about routing?

Thats the dynamic part! You can use routing in your konponents, AUTOMATICALLY!

And the best part is, you only need to create a file!

for example if i want to create a route for /about, all i need to do is create a file called about.html in the root folder and then i can use it in my html files!

main.html

```html

	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>My Konponent</title>
	</head>
	<body>
		>_my-konponent
		>_about
	</body>
	</html>

```

about.html

```html

	<h1>this is the about page!</h1>

```

## About features and more

\>_Kon! is still in development, so there are not many features yet, but we are working on it!

## How can I contribute?

You can contribute by creating a pull request or an issue on our github page!

## How can I contact you?  

You can contact us by sending an email to:

sabashi127@gmail.com

Thank you for using >_Kon!

```
>_Kon! loves you as much as you love it!
```