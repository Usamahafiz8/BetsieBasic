// tailwind.ts
import { create } from 'twrnc';

// `require` is fine here since tailwind.config.js is JS
const tw = create(require('../../../tailwind.config.js'));

export default tw;