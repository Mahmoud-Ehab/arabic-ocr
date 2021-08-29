export const scrollToBottom = (target) => {
    let destination = target.offsetTop + target.offsetHeight;

    document.scrollingElement.scrollTop = lerp(
        document.scrollingElement.scrollTop,
        destination * 1.05,
        0.05
    );
    
    if (document.scrollingElement.scrollTop < destination) {
        setTimeout(() => {
            scrollToBottom(target);
        }, 1000/60);
    }
    else {
        target.hidden = true;
        return true;
    }
}

export const toast = (text, color, time) => {
    let toastDiv = document.createElement('div');
    toastDiv.setAttribute(
        'style', 
        `position: fixed; 
        z-index: 100;
        bottom: 0;
        left: 0;
        margin: 10px;
        padding: 20px;
        border-radius: 15px; 
        text-alignment: center;
        box-shadow: black 5px 5px;
        color: white; 
        background-color: ${color};`);
        
    toastDiv.innerHTML = `<p>${text}</p>`;
    document.getElementById('AnalyzingSection').appendChild(toastDiv);

    setTimeout(() => toastDiv.remove(), time);
}

const lerp = (a, b, t) => {
    return (1-t)*a+b*t;
}
