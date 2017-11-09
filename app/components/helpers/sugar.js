import { when } from 'mobx';

function promiseWhen(functor) {
    return new Promise(resolve => when(functor, () => resolve(functor())));
}

export default { promiseWhen };
export { promiseWhen };
