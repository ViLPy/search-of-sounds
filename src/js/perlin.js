/**
 * Shuffle array in place
 * @param a - array to shuffle
 */
function shuffle(a) {
    for (let i = 0, l = a.length; i < l; i++) {
        const j = ~~(Math.random() * l);
        const x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

/**
 * @return {Array<number>}
 */
function getPerlinPermutations() {
    let perm = [];
    for (let i = 0; i < 256; i++) {
        perm[256 + i] = perm[i] = i;
    }
    shuffle(perm);
    return perm;
}

const PerlinNoise = (function () {
    const fallbackPermutations = getPerlinPermutations();

    /**
     * @param {number} t
     * @return {number}
     */
    function fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    /**
     * @param {number} n
     * @return {number}
     */
    function ff(n) {
        return (n > 0) ? ~~n : (~~n - 1);
    }

    /**
     * Linear interpolation
     * @param {number} t
     * @param {number} a
     * @param {number} b
     * @return {number}
     */
    function lerp(t, a, b) {
        return a + t * (b - a);
    }

    function grad(hash, x, y, z) {
        const h = hash & 15;
        let u = h < 8 ? x : y,
            v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    // Adapted version of Noise1234 by Stefan Gustavson (stegu@itn.liu.se)
    function noise(x, y, z, px, py, pz, perm = fallbackPermutations) {
        let ix0, iy0, ix1, iy1, iz0, iz1;
        let fx0, fy0, fz0, fx1, fy1, fz1;
        let s, t, r;
        let nxy0, nxy1, nx0, nx1, n0, n1;

        ix0 = ff(x); // Integer part of x
        iy0 = ff(y); // Integer part of y
        iz0 = ff(z); // Integer part of z
        fx0 = x - ix0; // Fractional part of x
        fy0 = y - iy0; // Fractional part of y
        fz0 = z - iz0; // Fractional part of z
        fx1 = fx0 - 1;
        fy1 = fy0 - 1;
        fz1 = fz0 - 1;
        ix1 = (( ix0 + 1 ) % px ) & 0xff; // Wrap to 0..px-1 and wrap to 0..255
        iy1 = (( iy0 + 1 ) % py ) & 0xff; // Wrap to 0..py-1 and wrap to 0..255
        iz1 = (( iz0 + 1 ) % pz ) & 0xff; // Wrap to 0..pz-1 and wrap to 0..255
        ix0 = ( ix0 % px ) & 0xff;
        iy0 = ( iy0 % py ) & 0xff;
        iz0 = ( iz0 % pz ) & 0xff;

        r = fade(fz0);
        t = fade(fy0);
        s = fade(fx0);

        nxy0 = grad(perm[ix0 + perm[iy0 + perm[iz0]]], fx0, fy0, fz0);
        nxy1 = grad(perm[ix0 + perm[iy0 + perm[iz1]]], fx0, fy0, fz1);
        nx0 = lerp(r, nxy0, nxy1);

        nxy0 = grad(perm[ix0 + perm[iy1 + perm[iz0]]], fx0, fy1, fz0);
        nxy1 = grad(perm[ix0 + perm[iy1 + perm[iz1]]], fx0, fy1, fz1);
        nx1 = lerp(r, nxy0, nxy1);

        n0 = lerp(t, nx0, nx1);

        nxy0 = grad(perm[ix1 + perm[iy0 + perm[iz0]]], fx1, fy0, fz0);
        nxy1 = grad(perm[ix1 + perm[iy0 + perm[iz1]]], fx1, fy0, fz1);
        nx0 = lerp(r, nxy0, nxy1);

        nxy0 = grad(perm[ix1 + perm[iy1 + perm[iz0]]], fx1, fy1, fz0);
        nxy1 = grad(perm[ix1 + perm[iy1 + perm[iz1]]], fx1, fy1, fz1);
        nx1 = lerp(r, nxy0, nxy1);

        n1 = lerp(t, nx0, nx1);

        return 0.936 * ( lerp(s, n0, n1) );
    }

    return noise;
})();
