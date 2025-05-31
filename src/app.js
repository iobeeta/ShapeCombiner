import './app.less'

const bodyIds = [ 33, 34, 637, 11001 ];
const torsoIds = [ 649, 678, 683, 756, 36, 105, 507, 684, 685, 693, 675, 38, 676, 157 ];
const legsIds = [ 652, 692, 37, 842, 795, 879, 753, 841, 515 ];

function readFile(file) {
    console.log(file);
    return new Promise((resolve, reject) => {
        let fileContent = '';
        let fileReader = new FileReader();
        fileReader.onloadend = (event) => {
            fileContent = event.target.result;
            resolve(fileContent);
        };
        fileReader.onerror = (error) => { reject(error) };
        fileReader.readAsText(file);
    });
}

async function getXml(fileInputId) {
    const parser = new DOMParser();
    const file = document.getElementById(fileInputId).files[0];
    const fileContent = await readFile(file);
    return parser.parseFromString(fileContent, "text/xml");
}

$("#combine").on("click", async function mergeShapes() {
    const headXml = await getXml("headInput");
    const bodyXml = await getXml("bodyInput");

    if (headXml.querySelector("parsererror") ||
        bodyXml.querySelector("parsererror")) {
        alert("Error reading shape files.");
    } else {
        [].concat(bodyIds, torsoIds, legsIds).forEach(id => {
            let sourceNode = bodyXml.querySelector("[id='" + id + "']");
            let targetNode = headXml.querySelector("[id='" + id + "']");
            targetNode.getAttributeNode("value").nodeValue = sourceNode.getAttributeNode("value").nodeValue;
            targetNode.getAttributeNode("u8").nodeValue = sourceNode.getAttributeNode("u8").nodeValue;
        });
        const combinedShapeString = new XMLSerializer().serializeToString(headXml);
        const combinedShapeBlob = new Blob([combinedShapeString], { type: "text/xml" });
        const fileURL = URL.createObjectURL(combinedShapeBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = fileURL;
        downloadLink.download = "combined-shape.xml";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        URL.revokeObjectURL(fileURL);
    }
});

$("#headInput").on("change", (e) => {
    $("#headFileName").text(e.target.files[0].name);
});

$("#bodyInput").on("change", (e) => {
    $("#bodyFileName").text(e.target.files[0].name);
});