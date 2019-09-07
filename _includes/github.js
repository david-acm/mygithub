
function GithubRepository(user, repository) {
	this.user = user;
	this.repository = repository;
	this.githubRepository = user + "/" + repository;
}


GithubRepository.prototype.getAssetName = function () {
	var pathname = document.location.pathname.split("/").slice(-1)[0];
	if (pathname == this.repository) return "";
	else return pathname;
}

GithubRepository.prototype.redirectToReleaseFile = function (release) {
	console.log(release);
	var index = this.getQueryParam("index");
	if(!index){
		var assetName = this.getAssetName();
	var i = assetName? parseInt(assetName): 0;
	if (i >= 0 && i < release.assets.length) assetName = release.assets[i].name;
		var downloaded = false;
		var names = [];
		for (var i = 0; i < release.assets.length; ++i) {
			var asset = release.assets[i];
			names.push(asset.name);
			if (asset.name == assetName) {
				downloadAsset(asset.browser_download_url);
				downloaded = true;
			}
		}
		if (!downloaded) {
			couldNotDownloadAsset("File " + assetName + " not found. Should be one of " + names.join(", ") + ".");
		}
	} else {
		// making 0 as default index
		index = index ? index : 0;
		if(release.assets.length > index){
			downloadAsset(release.assets[index].browser_download_url);
		} else {
			couldNotDownloadAsset("No file found with index " + index + "." +
				" Number of files: " + release.assets.length);
		}
	}
}

GithubRepository.prototype.startDownload = function () {
	var url = "https://api.github.com/repos/" + this.githubRepository + "/releases/latest";
	var repository = this;
	httpRequest(url, function(httpreq) {
		repository.redirectToReleaseFile(JSON.parse(httpreq.responseText));
	}, function () {
		couldNotDownloadAsset("Invalid repository name.")
	});
}


/**
 * get href query param by key
 */
GithubRepository.prototype.getQueryParam = function(param) {
	var result = window.location.search.match(
		new RegExp("(\\?|&)" + param + "(\\[\\])?=([^&]*)")
	);

	return result ? result[3] : false;
}
