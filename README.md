# Hidden World
## The Hidden World Beneath Our Feet
A Young Zoologist’s Field Journal: a static, expandable zoology portfolio built with HTML, CSS, JavaScript, and JSON. No build step or package installation is required.

The initial collection contains 14 **candidate animal groups**, not verified sightings. Original photographs, observations, personal biography, and investigation results have not been supplied. The isopod illustration is decorative, not observation evidence. The website foundation was created with AI assistance; field research must be independently documented and accurately credited.

### Preview locally
```sh
cd /workspace/MyFirstAI
python3 -m http.server 8000 --bind 127.0.0.1
```
Open the site through your local development setup. Serve over HTTP; opening `index.html` directly will block JSON loading in many browsers.

### Add content
See [the data entry guide](docs/data-entry-guide.md), [research methods](docs/research-methods.md), and [sources](docs/sources.md). Edit the JSON files under `data/`, add photos under `assets/images/wildlife/`, preview, then commit and push. Use **Edit animals** for a visual editor with browser drafts and downloadable JSON. Publishing still requires committing the downloaded file to GitHub. The expandable **Taxonomy tree** groups records from Kingdom to Species, leaving uncertain ranks unclassified.

### Publish with GitHub Pages
In this repository’s **Settings → Pages**, select **Deploy from a branch**, choose the branch containing this site (normally `main`), and choose **/ (root)**. Save. GitHub will provide the deployed URL after publishing. No custom domain or build workflow is required. Publishing is separate from committing and pushing the files.

### Checks
```sh
node --check assets/js/app.js
python3 -m json.tool data/animals.json > /dev/null
python3 -m json.tool data/journal.json > /dev/null
python3 -m json.tool data/investigations.json > /dev/null
```
Also preview the page and check search, filters, profiles, and mobile layout after changing data.

The interface uses system/Georgia fallbacks if optional Google Fonts cannot load. No analytics, login, or backend is included. Do not put private locations or personal contact details in the public data.
