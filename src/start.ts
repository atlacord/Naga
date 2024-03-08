import Naga from './Core/Naga';

const config: any = {
    client: {
        intents: process.env.INTENTS
    }
}

const naga = new Naga();

naga.setup(config.client);