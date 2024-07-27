const blogName = "juelule";
const recentPostsCutoff = 10; // set the number of most-recent posts displayed on the index page
const headerMessageOn = true; // switch header messages on (true) or off (false)s

const postsArray = [
	{
		path: "2022-04-21-images-and-galleries",
		title: "Images and galleries",
		tags: ["your blog", "images"]
	},
	{
		path: "2022-04-20-example-post",
		title: "Example post",
		tags: ["your blog", "first post"]
	}
];

for (let i in postsArray) postsArray[i].path = "posts/" + postsArray[i].path + ".html";
for (let i in postsArray) postsArray[i].image = "images/" + postsArray[i].image;

function formatPostLink(i, postsArray_i) { 
	let linkText = "";
	const postTitle_i = postsArray_i[i].title;

	linkText += '<li><img src=' + relativePath + '/' + postsArray_i[i].image + ' /><a href="' + relativePath + '/' + postsArray_i[i].path + '">';

	if (postDateFormat.test (postsArray_i[i].path.slice(6,17))) linkText += postsArray_i[i].path.slice(6,16) + " \u2192 ";	
	linkText += postTitle_i + '</a></li>';
	return linkText;
}

function buildPostIndex(tagType, emptyMessage) { // take a json object of posts pre-sorted by tags (or another parameter) and output HTML for a list of tags, each of which has a sub-lists of posts
	let listText = "";

	for (let i = 0; i < postsArray.length; i++) { // set up an object of all posts by tag
		for (let j = 0; j < postsArray[i][tagType].length; j++) {
			if (typeof allTags[postsArray[i][tagType][j]] == 'undefined') allTags[postsArray[i][tagType][j]] = [];
			
			allTags[postsArray[i][tagType][j]].push({path: postsArray[i].path, title: postsArray[i].title, image: postsArray[i].image});
			}
			}
			
	const allTagNames = Object.keys(allTags).sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));

	if (allTagNames.length > 0) {
		for (let i = 0; i < allTagNames.length; i++) {
			let tagName = allTagNames[i];

			listText += '<li><details id="--' + tagName.replace(/ /g,"-") + '"><summary>' + tagName + '</summary><ul class="post-list">';
			for (let j = 0; j < allTags[tagName].length; j++) listText += formatPostLink(j, allTags[tagName]);
			listText += '</ul></details></li>';
		}
	} else listText += '<li>' + emptyMessage + '</li>';

	return listText;
}

function buildPostList(tagType, emptyMessage) { // take a json object of posts pre-sorted by tags (or another parameter) and output HTML for a list of tags, each of which has a sub-lists of posts
	let listLinks = "";

	for (let i = 0; i < postsArray.length; i++) { // set up an object of all posts by tag
		for (let j = 0; j < postsArray[i][tagType].length; j++) {
			if (typeof allTags[postsArray[i][tagType][j]] == 'undefined') allTags[postsArray[i][tagType][j]] = [];
			
			allTags[postsArray[i][tagType][j]].push({path: postsArray[i].path, title: postsArray[i].title, image: postsArray[i].image});
			}
			}
			
	const allTagNames = Object.keys(allTags).sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));

	if (allTagNames.length > 0) {
		for (let i = 0; i < allTagNames.length; i++) {
			let tagName = allTagNames[i];

			listLinks += '<li><a href="/tags/' + tagName.replace(/ /g,"-") +'.html">' + tagName + '</a></li>';
		}
	} else listLinks += '<li>' + emptyMessage + '</li>';

	return listLinks;
}

function buildTag(tag, emptyMessage) { // take a json object of posts pre-sorted by tags (or another parameter) and output HTML for a list of tags, each of which has a sub-lists of posts
	let listText = "";

	for (let i = 0; i < postsArray.length; i++) { // set up an object of all posts by tag
		for (let j = 0; j < postsArray[i]["tags"].length; j++) {
			if (postsArray[i]["tags"][j] == tag) {
				if (typeof allTags[postsArray[i]["tags"][j]] == 'undefined') allTags[postsArray[i]["tags"][j]] = [];
				allTags[tag].push({path: postsArray[i].path, title: postsArray[i].title, image: postsArray[i].image});
				}
			}
		}
			
	const allTagNames = Object.keys(allTags).sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));

	if (allTagNames.length > 0) {
		for (let i = 0; i < allTagNames.length; i++) {
			let tagName = allTagNames[i];

			listText += '<div>';
			for (let j = 0; j < allTags[tagName].length; j++) listText += formatPostLink(j, allTags[tag]);
			listText += '</div>';
		}
	} else listText += '<li>' + emptyMessage + '</li>';

	return listText;
}

const url = window.location.pathname;

// final array of blog items (outer key: variable name, inner values: HTML element id/class and inner HTML)
const blog = {
	header: {id: "header", HTML: ""},
	niceDate: {id: "post-date", HTML: ""},
	postMeta: {id: "post-meta", HTML: ""},
	postNav: {id: "post-nav", HTML: ""},
	footer: {id: "footer", HTML: ""},
	archivePostList: {id: "archive-post-list", HTML: ""},
	recentPostList: {id: "recent-post-list", HTML: ""},
	tagPostList: {id: "tag-post-list", HTML: ""},
	tagsList: {id: "tags-list", HTML: ""},
	tagIndex: {id: "tag-index", HTML: ""}
};

// if reader is in posts, put relative path up by one directory
const relativePath = (url.includes("posts/") || url.includes("tags/")) ? ".." : ".";

const postDateFormat = /\d{4}\-\d{2}\-\d{2}\-/;

// write the header HTML
blog.header.HTML += '<nav id="main-nav"><ul>' +
'<li><a href="' + relativePath + '/index.html">' + blogName + '</a></li>' +
'<li><a href="' + relativePath + '/about.html">About</a></li>' +
'<li><a href="' + relativePath + '/tags.html">Tags</a></li>' +
'<li><a href="' + relativePath + '/archive.html">Archive</a></li>'
'</ul></nav>';


// find current location in postsArray (leave currentIndex set to -1 if on any other page)
let currentIndex = -1;
const currentFilename = url.substring(url.lastIndexOf('posts/'));
for (let i = 0; i < postsArray.length; i++) {
	if (postsArray[i].path === currentFilename) {
		currentIndex = i;
		break;
	}
}

/* -------------------
	3.1. POST PAGE
------------------- */

// get the current post title, date, and tags (if on a post page), and the post nav links
const tagList = [];

if (currentIndex > -1) {
	// generate more-readable date
	if (postDateFormat.test (postsArray[currentIndex].path.slice(6,17))) {
		const monthNums2Names = {
			"01": "Jan",
			"02": "Feb",
			"03": "Mar",
			"04": "Apr",
			"05": "May",
			"06": "Jun",
			"07": "Jul",
			"08": "Aug",
			"09": "Sep",
			"10": "Oct",
			"11": "Nov",
			"12": "Dec"
		};
		blog.niceDate.HTML += postsArray[currentIndex].path.slice(14,16) + " " + monthNums2Names[postsArray[currentIndex].path.slice(11,13)] + ", " + postsArray[currentIndex].path.slice(6,10);
	}

	document.getElementById("post-date").setAttribute("datetime",postsArray[currentIndex].path.slice(6,16));

	// generate post tags HTML
	if (postsArray[currentIndex].tags.length > 0) {
		postsArray[currentIndex].tags.sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));
		for (let i = 0; i < postsArray[currentIndex].tags.length; i++) {
	  		let tagName = postsArray[currentIndex].tags[i];
			tagList[i] = '<li><a href="' + relativePath + '/tags.html#--' + tagName.replace(/\s/g,"-") + '" rel="tag">' + tagName + '</a></li>';
		}
	} else {
		tagList[0] = "none";
	}

	blog.postMeta.HTML += '<dt>Tags</dt><dd id="tag-list">' + tagList.join("") + '</dd>';

	// generate post nav HTML
	let prevPost,
	nextPost;

	// if before latest post:
	if (currentIndex > 0) {
		prevPost = postsArray[currentIndex - 1];
		blog.postNav.HTML += '<div><a href="' + relativePath + '/' + prevPost.path + '" rel="next">\u2190 Next Post</a><p>' + prevPost.title + '</p></div>';
	} else blog.postNav.HTML += '<div>Latest post!</div>';

	// if after earliest post:
	if (0 <= currentIndex && currentIndex < postsArray.length - 1) {
		nextPost = postsArray[currentIndex + 1];
		blog.postNav.HTML += '<div><a href="'+ relativePath + '/' + nextPost.path + '" rel="prev">Previous Post \u2192</a><p>' + nextPost.title + '</p></div>';
	} else blog.postNav.HTML += '<div>First post!</div>';
}

/* ----------------------
	3.2. ARCHIVE LIST
---------------------- */

// generate the Post List HTML
if (document.getElementById(blog.archivePostList.id)) {
	for (let i = 0; i < postsArray.length; i++) {
		blog.archivePostList.HTML += formatPostLink(i, postsArray);
	}
}

/* --------------------------
	3.3. RECENT POST LIST
-------------------------- */

// generate the Recent Post List HTML
if (document.getElementById(blog.recentPostList.id)) {
	const numberOfRecentPosts = Math.min(recentPostsCutoff, postsArray.length);
	for (let i = 0; i < numberOfRecentPosts; i++) {
		blog.recentPostList.HTML += formatPostLink(i, postsArray);
	}

	// if there are more posts than the cutoff, end the list with a link to the Archive
	if (postsArray.length > recentPostsCutoff) {
		blog.recentPostList.HTML += '<li id="more-posts"><a href=' + relativePath + '/archive.html>\u2192 more posts</a></li>';
	}
}

// generate the tagPostList HTML

/* -------------------
	3.4. TAG INDEX
------------------- */

// if reader is on the tags page, generate the Tag Index HTML
const allTags = {};

if (document.getElementById(blog.tagIndex.id)) blog.tagIndex.HTML = buildPostIndex("tags", 'This blog currently uses no tags!');
if (document.getElementById(blog.tagsList.id)) blog.tagsList.HTML = buildPostList("tags", 'This blog currently uses no tags!');
if (document.getElementById(blog.tagPostList.id)) {
	let tagURL = url.split('.')[0].split('/')[2].replace("-", ' ');
	console.log(tagURL)
	blog.tagPostList.HTML += tagURL;

	blog.tagPostList.HTML += buildTag(tagURL, 'This blog currently uses no tags!')
}

/* =================================
	4. INSERTING HTML INTO PAGES
================================= */

// for each blog item, if its element is in the file, insert its HTML
for (let i in blog) {
	const element = document.getElementById(blog[i].id);
	if (element) element.innerHTML = blog[i].HTML;
	else {
		const elements = document.getElementsByClassName(blog[i].id);
		if (elements.length > 0) {
			for (let j in elements) {
				elements[j].innerHTML = blog[i].HTML;
			}
		}
	}
}

// if on an index page, open the selected item's sub-list (if any) using its id
if (document.querySelector(".index") && window.location.hash) document.getElementById(window.location.hash.slice(1))?.setAttribute("open", "");