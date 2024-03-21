import Naga from './Core/Naga';

const naga = new Naga();

console.info('NAGA - Version: 3.0.0, Build: 17\n\n');

console.info('Initializing client');
naga.setup(naga.config.client.options);