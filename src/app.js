import './app.less'

const CTX_WORKING_PANEL = $('#canvas-working-panel').get(0).getContext("2d")
const INPUT_FILE = $('#file-input')
const INPUT_STATS = $('#stats')
const IMG_LIST = $("#container-img")
let CURRENT_IMAGE = ""
const IMAGES = []
console.log(CTX_WORKING_PANEL)

function Render() {
    if(CURRENT_IMAGE == "") return;
    let img = new Image()
    img.onload = function() {
        let stats = +INPUT_STATS.val()
        let size = 2048 / stats
        let canvas = document.createElement('canvas'),ctx = canvas.getContext('2d')
        canvas.height = img.height
        canvas.width = img.width
        ctx.drawImage(img, 0, 0, img.width, img.height)
        CTX_WORKING_PANEL.clearRect(0, 0, 2048, 2048)
        for(let i = 0; i < stats; i++) {
            CTX_WORKING_PANEL.drawImage(canvas, size * i, size * i, size, size)
        }
    }
    img.src = CURRENT_IMAGE
}

const loadImage = async function(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = async function(e) {
            const image = new Image();
            image.src = e.target.result
        
            image.onload = function() {
                resolve(image);
            }
            image.onerror = reject;
        }
        
        reader.onerror = reject;
        reader.readAsDataURL(file);
    })
}

INPUT_FILE.on('change', async function(e) {
    console.log(e.target.files)
    let len = e.target.files.length
    let startIndex = IMAGES.length
    for(let i = 0; i < len; i++) {
        let index = "s" + e.target.files[i].size + "_" + e.target.files[i].name;
        if(IMAGES.indexOf(index) == -1) {
            IMAGES.push(index)
            let img = await loadImage(e.target.files[i])
            IMG_LIST.append($('<div class="thumbnail"></div>').append(img))
        }
    }
    IMG_LIST.find('.force').removeClass('force')
    let t = IMG_LIST.children().eq(startIndex)
    t.addClass('force')
    CURRENT_IMAGE = t.find('img').attr('src')
    Render();
})

IMG_LIST.delegate('.thumbnail', 'click', {}, function(e) {
    IMG_LIST.find('.force').removeClass('force')
    let el = $(this)
    el.addClass('force')
    CURRENT_IMAGE = el.find('img').attr('src')
    Render()
})

INPUT_STATS.on('change', function(e) {
    Render()
})