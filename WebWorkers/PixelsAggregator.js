onmessage = function(e) {
    const imgData = e.data.imgData;
    const width = e.data.width;
    const height = imgData.length / width;

    // Get Image Data
    let aggrePixels = []

    for (let r = 0; r < height; r++) {
        let line = []
        let pixel = []

        for (let i = r*width; i < (r+1)*width; i++) {
            if (pixel.length < 3)
                pixel.push(imgData[i]);
            else {
                line.push(pixel);
                pixel = [];
            }
        }

        aggrePixels.push(line);
    }

    postMessage(aggrePixels);
}
