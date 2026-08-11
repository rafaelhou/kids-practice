/* 沒有合適 emoji 的字，自己畫。
   全部 100x100，扁平配色，和 emoji 並排時不會突兀。 */
window.ICONS = {

vase:
 '<svg viewBox="0 0 100 100">' +
 '<path d="M44 18h12l-2 10h-8z" fill="#7cb46b"/>' +
 '<circle cx="38" cy="20" r="8" fill="#e8607a"/><circle cx="62" cy="20" r="8" fill="#f2a63c"/>' +
 '<circle cx="50" cy="12" r="8" fill="#e8607a"/>' +
 '<circle cx="38" cy="20" r="3" fill="#fff3d6"/><circle cx="62" cy="20" r="3" fill="#fff3d6"/>' +
 '<circle cx="50" cy="12" r="3" fill="#fff3d6"/>' +
 '<path d="M40 30h20l6 12c4 8 4 22-2 30-4 6-24 6-28 0-6-8-6-22-2-30z" fill="#4a9bd1"/>' +
 '<path d="M40 30h20l2 5H38z" fill="#2f7fb3"/>' +
 '<ellipse cx="44" cy="58" rx="4" ry="9" fill="#8fc9ea" opacity=".7"/>' +
 '</svg>',

jug:
 '<svg viewBox="0 0 100 100">' +
 '<path d="M36 22h28v8H36z" fill="#4a90c4"/>' +
 '<path d="M34 30h32l4 14v34c0 5-4 8-8 8H38c-4 0-8-3-8-8V44z" fill="#8fd0f0"/>' +
 '<path d="M70 44h6c5 0 9 4 9 10s-4 10-9 10h-5v-8h5c1 0 2-1 2-2s-1-2-2-2h-6z" fill="#8fd0f0"/>' +
 '<path d="M32 56h36v22c0 5-4 8-8 8H40c-4 0-8-3-8-8z" fill="#4a90c4" opacity=".55"/>' +
 '<rect x="38" y="18" width="24" height="6" rx="3" fill="#2f6f9c"/>' +
 '</svg>',

queen:
 '<svg viewBox="0 0 100 100">' +
 '<path d="M28 34l6-16 8 10 8-14 8 14 8-10 6 16z" fill="#f0c33c"/>' +
 '<rect x="28" y="34" width="44" height="7" rx="2" fill="#e0a92c"/>' +
 '<circle cx="34" cy="20" r="3.5" fill="#e8607a"/><circle cx="50" cy="16" r="3.5" fill="#4a9bd1"/>' +
 '<circle cx="66" cy="20" r="3.5" fill="#e8607a"/>' +
 '<circle cx="50" cy="56" r="14" fill="#f2c9a0"/>' +
 '<path d="M36 52c0-8 6-12 14-12s14 4 14 12c0 3-2 4-3 2-3-5-8-6-11-6s-8 1-11 6c-1 2-3 1-3-2z" fill="#6b4a2c"/>' +
 '<circle cx="45" cy="56" r="1.8" fill="#3d3128"/><circle cx="55" cy="56" r="1.8" fill="#3d3128"/>' +
 '<path d="M46 63q4 3 8 0" stroke="#c4715a" stroke-width="2" fill="none" stroke-linecap="round"/>' +
 '<path d="M30 92c0-12 9-20 20-20s20 8 20 20z" fill="#8a5fb0"/>' +
 '<path d="M50 72c-4 0-6 3-6 6h12c0-3-2-6-6-6z" fill="#fff3d6"/>' +
 '</svg>',

wagon:
 '<svg viewBox="0 0 100 100">' +
 '<path d="M18 44h60c3 0 5 2 5 5v18c0 3-2 5-5 5H18c-3 0-5-2-5-5V49c0-3 2-5 5-5z" fill="#d64545"/>' +
 '<path d="M13 60h72v7c0 3-2 5-5 5H18c-3 0-5-2-5-5z" fill="#a83232"/>' +
 '<path d="M78 46l12-16" stroke="#7d7d85" stroke-width="5" stroke-linecap="round" fill="none"/>' +
 '<circle cx="91" cy="27" r="5" fill="#5a5a62"/>' +
 '<circle cx="30" cy="80" r="10" fill="#3d3d45"/><circle cx="30" cy="80" r="4" fill="#c9c9d1"/>' +
 '<circle cx="68" cy="80" r="10" fill="#3d3d45"/><circle cx="68" cy="80" r="4" fill="#c9c9d1"/>' +
 '</svg>',

fan:
 '<svg viewBox="0 0 100 100">' +
 '<rect x="44" y="62" width="12" height="18" fill="#5a6675"/>' +
 '<path d="M28 88h44c2 0 3-2 2-4l-4-6H30l-4 6c-1 2 0 4 2 4z" fill="#3f4a58"/>' +
 '<circle cx="50" cy="40" r="30" fill="#dbe6f0"/><circle cx="50" cy="40" r="26" fill="#4a90c4"/>' +
 '<path d="M50 40c0-14 4-20 10-20s8 8 2 14z" fill="#8fd0f0"/>' +
 '<path d="M50 40c12-7 19-6 22 0s-4 11-11 7z" fill="#8fd0f0"/>' +
 '<path d="M50 40c7 12 6 19 0 22s-11-4-7-11z" fill="#8fd0f0"/>' +
 '<path d="M50 40c-12 7-19 6-22 0s4-11 11-7z" fill="#8fd0f0"/>' +
 '<circle cx="50" cy="40" r="6" fill="#2f6f9c"/>' +
 '</svg>',

lamp:
 '<svg viewBox="0 0 100 100">' +
 '<path d="M30 44l8-24h24l8 24z" fill="#f2b93c"/>' +
 '<path d="M30 44h40l-2 5H32z" fill="#d99a22"/>' +
 '<rect x="46" y="49" width="8" height="26" fill="#5a6675"/>' +
 '<path d="M30 86h40c2 0 3-2 2-4l-3-7H31l-3 7c-1 2 0 4 2 4z" fill="#3f4a58"/>' +
 '<path d="M40 26h20l3 10H37z" fill="#fff3d6" opacity=".5"/>' +
 '</svg>',

dad:
 '<svg viewBox="0 0 100 100">' +
 '<circle cx="42" cy="26" r="14" fill="#f2c9a0"/>' +
 '<path d="M28 24c0-9 6-14 14-14s14 5 14 14c0 2-1 3-2 1-2-4-7-5-12-5s-10 1-12 5c-1 2-2 1-2-1z" fill="#3d3128"/>' +
 '<circle cx="37" cy="27" r="1.8" fill="#3d3128"/><circle cx="47" cy="27" r="1.8" fill="#3d3128"/>' +
 '<path d="M37 34q5 4 10 0" stroke="#c4715a" stroke-width="2" fill="none" stroke-linecap="round"/>' +
 '<path d="M20 92c0-18 10-28 22-28s22 10 22 28z" fill="#5b8fc7"/>' +
 '<path d="M42 64c8 0 16 5 20 14l-8 5c-3-6-7-9-12-9z" fill="#4a7cb0"/>' +
 '<ellipse cx="70" cy="72" rx="14" ry="11" fill="#fbe3ea"/>' +
 '<circle cx="72" cy="66" r="9" fill="#f7d2b0"/>' +
 '<path d="M64 62q8-6 16 0" stroke="#c99a6a" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
 '<circle cx="69" cy="66" r="1.4" fill="#3d3128"/><circle cx="76" cy="66" r="1.4" fill="#3d3128"/>' +
 '</svg>',

bat:
 '<svg viewBox="0 0 100 100">' +
 '<path d="M22 78c-4-4-4-8 0-12l6-6 12 12-6 6c-4 4-8 4-12 0z" fill="#8a5a30"/>' +
 '<rect x="24" y="66" width="16" height="5" rx="2" transform="rotate(45 32 68)" fill="#5f3d1f"/>' +
 '<path d="M34 58L62 30c8-8 18-10 22-6s2 14-6 22L50 74z" fill="#d9a05b"/>' +
 '<path d="M62 30c8-8 18-10 22-6s2 14-6 22z" fill="#c98b45"/>' +
 '<path d="M40 56l24-24" stroke="#e8c290" stroke-width="3" stroke-linecap="round" fill="none" opacity=".6"/>' +
 '</svg>',

band:
 '<svg viewBox="0 0 100 100">' +
 '<circle cx="36" cy="58" r="26" fill="#f0ede4"/>' +
 '<circle cx="36" cy="58" r="26" fill="none" stroke="#c4453a" stroke-width="6"/>' +
 '<circle cx="36" cy="58" r="9" fill="#c4453a"/>' +
 '<path d="M8 36l14 14" stroke="#8a5a30" stroke-width="5" stroke-linecap="round" fill="none"/>' +
 '<circle cx="7" cy="34" r="5" fill="#f0c33c"/>' +
 '<path d="M64 34h6v30h-6z" fill="#f0c33c"/>' +
 '<path d="M62 30h22c3 0 5 2 5 5s-2 5-5 5H62z" fill="#f0c33c"/>' +
 '<path d="M70 64c0 8 6 14 14 14s14-6 14-14z" fill="#e0a92c"/>' +
 '<rect x="72" y="42" width="5" height="10" rx="2" fill="#d99a22"/>' +
 '<rect x="81" y="42" width="5" height="10" rx="2" fill="#d99a22"/>' +
 '</svg>'

};
