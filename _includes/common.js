
/* --- Interface functions --- */

function downloadAsset(asset) {
	document.location = asset;
	setStatus("Download started.");
}

function couldNotDownloadAsset(text) {
	console.log("Could not download asset from release.");
	setStatus("Failed to download file" + (text ? ": " + text : "."));
}

function setStatus(text) {
	var status = document.getElementById("status");
	status.innerText = text;
}

/* --- Initialization --- */

function startDownload() {
	var path = document.location.pathname.split("/").slice(2);
	var repository;
	if (path[0] == 'gh' && path.length >= 3) {
		repository = new GithubRepository(path[1], path[2])
	}
	else {
		couldNotDownloadAsset();
		return;
	}
	repository.startDownload();
}

/* --- helper functions --- */

// onSuccess and onError are called with the XMLHttpRequest as first argument
function httpRequest(url, onSuccess, onError) {
	var httpreq = new XMLHttpRequest();
	var repository = this;
	httpreq.open("GET", url, true);
	httpreq.onload = function(e) {
		if (httpreq.readyState === 4) {
			if (httpreq.status === 200) {
				onSuccess(httpreq);
			} else {
				onError(httpreq);
			}
		}
	}
	if (onError) {
		httpreq.onerror = function(e) {
			onError(httpreq);
		}
	} else {
		httpreq.onerror = onError = function() {
			console.error(httpreq.statusText);
		}
	}
	httpreq.send(null);
}
