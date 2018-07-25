import Loadable from 'react-loadable';
import AsyncLoadingView from './AsyncLoadingView';

const AsyncLoader = opts =>
    Loadable(
        Object.assign(
            {
                loading: AsyncLoadingView,
                delay: 500,
                timeout: 10000
            },
            opts
        )
    );

export default AsyncLoader;
