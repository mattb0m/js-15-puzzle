var TILE_EMPTY = 256, TILE_WIDTH = 64;
window.puzzle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, TILE_EMPTY];

/* init a new puzzle */
function init(src) {
    var img, c1, c2, ctx; 
    img = document.createElement('img');
    
    img.onload = function() {
        c1 = document.getElementById('origin');
        c2 = document.getElementById('puzzle');
        c1.width = c1.height = c2.width = c2.height = 256;
        ctx = c1.getContext('2d');
        ctx.drawImage(img, 0, 0, 256, 256);
        generate_brute_force();
        draw_puzzle();
    };
    
    img.src = src;
};

/* Get inversion count for a given tile */
function get_inversion(idx) {
    var ret_val = 0, i;

    for(i = idx + 1; i < 16; ++i) {
        if(window.puzzle[idx] > window.puzzle[i]) {
            ++ret_val;
        }
    }

    return ret_val;
}

/* Generate a random puzzle by brute force */
function generate_brute_force() {
    var i, j, t, sum;
    
    do {
        /* shuffle tiles */
        for(i = 15; i > 0; --i) {
            j = (Math.random() * (i + 1)) | 0;
            t = window.puzzle[i];
            window.puzzle[i] = window.puzzle[j];
            window.puzzle[j] = t;
        }
        
        /* Calculate the sum of inversions to determine if puzzle is solvable */
        for(i = 0; i < 16; ++i) {
            if(window.puzzle[i] < TILE_EMPTY) {
                sum += get_inversion(i);
            } else {
                sum += (i / 4 + 1);
            }
        }
    } while(sum % 2);
}

/* draw initial puzzle state on canvas */
function draw_puzzle() {
    var c, src, ctx, x_src, y_src, x_dest, y_dest;
    
    c = document.getElementById('puzzle');
    ctx = c.getContext('2d');
    ctx.fillStyle="#FFF";
    src = document.getElementById('origin');
    
    for(i = 0; i < 16; ++i) {
        x_dest = (i % 4) * TILE_WIDTH;
        y_dest = ((i / 4) | 0) * TILE_WIDTH;
        
        if(window.puzzle[i] < TILE_EMPTY) {
            x_src = ((window.puzzle[i] - 1) % 4) * TILE_WIDTH;
            y_src = (((window.puzzle[i] - 1) / 4) | 0) * TILE_WIDTH;
            ctx.drawImage(src, x_src, y_src, TILE_WIDTH, TILE_WIDTH, x_dest, y_dest, TILE_WIDTH, TILE_WIDTH);
        } else {
            ctx.fillRect(x_dest, y_dest, TILE_WIDTH, TILE_WIDTH); 
        }
    }
}

/* Slide a tile on click */
function slide_tile(e) {
    var idx, c, ctx, x_src, y_src;
    
    c = document.getElementById('puzzle');
    ctx = c.getContext('2d');
    idx = (((e.clientY - e.target.offsetTop) / TILE_WIDTH) | 0) * 4 + (((e.clientX - e.target.offsetLeft) / TILE_WIDTH) | 0);
    x_src = (idx % 4) * TILE_WIDTH;
    y_src = ((idx / 4) | 0) * TILE_WIDTH;
    
    if(idx > 3 && window.puzzle[idx - 4] === TILE_EMPTY) {
        window.puzzle[idx - 4] = window.puzzle[idx];
        window.puzzle[idx] = TILE_EMPTY;
        ctx.drawImage(c, x_src, y_src, TILE_WIDTH, TILE_WIDTH, x_src, y_src - TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
        ctx.fillRect(x_src, y_src, TILE_WIDTH, TILE_WIDTH);
        check_win();
        
    } else if(idx % 4 < 3 && window.puzzle[idx + 1] === TILE_EMPTY) {
        window.puzzle[idx + 1] = window.puzzle[idx];
        window.puzzle[idx] = TILE_EMPTY;
        ctx.drawImage(c, x_src, y_src, TILE_WIDTH, TILE_WIDTH, x_src + TILE_WIDTH, y_src, TILE_WIDTH, TILE_WIDTH);
        ctx.fillRect(x_src, y_src, TILE_WIDTH, TILE_WIDTH);
        check_win();
        
    } else if(idx < 12 && window.puzzle[idx + 4] === TILE_EMPTY) {
        window.puzzle[idx + 4] = window.puzzle[idx];
        window.puzzle[idx] = TILE_EMPTY;
        ctx.drawImage(c, x_src, y_src, TILE_WIDTH, TILE_WIDTH, x_src, y_src + TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
        ctx.fillRect(x_src, y_src, TILE_WIDTH, TILE_WIDTH);
        check_win();
        
    } else if(idx % 4 > 0 && window.puzzle[idx - 1] === TILE_EMPTY) {
        window.puzzle[idx - 1] = window.puzzle[idx];
        window.puzzle[idx] = TILE_EMPTY;
        ctx.drawImage(c, x_src, y_src, TILE_WIDTH, TILE_WIDTH, x_src - TILE_WIDTH, y_src, TILE_WIDTH, TILE_WIDTH);
        ctx.fillRect(x_src, y_src, TILE_WIDTH, TILE_WIDTH);
        check_win();
    }
}

/* Validate the winning condition AND update display on win */
function check_win() {
    var win = true, i, c, ctx;
    
    for(i = 0; i != 16; ++i) {
        win = win && (window.puzzle[i] === i+1);
    }
    
    if(win) {
        c = document.getElementById('puzzle');
        ctx = c.getContext('2d');
        ctx.drawImage(document.getElementById('origin'), 3 * TILE_WIDTH, 3 * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH, 3 * TILE_WIDTH, 3 * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
        c.onclick = '';
        document.getElementById('msg').innerHTML = 'YOU WIN!<br>Refresh the page to play again.';
    }
    
    return win;
}
