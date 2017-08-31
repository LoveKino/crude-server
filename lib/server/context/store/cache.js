module.exports = ({
    maxCacheSize,
    expireTime
}) => {
    let map = {};
    let timeline = [];
    let sumCacheSize = 0;

    let setCache = (key, value, size) => {
        let date = new Date().getTime();
        let cacheObj = {
            key,
            value,
            date,
            size
        };
        map[key] = cacheObj;
        timeline.push(cacheObj);
        sumCacheSize += size;

        clearExpires();
        reduceCacheSize();
    };

    let getCache = (key) => {
        return map[key];
    };

    let reduceCacheSize = () => {
        while (timeline.length && sumCacheSize > maxCacheSize) {
            removeOldest();
        }
    };

    let clearExpires = () => {
        let now = new Date().getTime();
        while (timeline.length) {
            let oldest = timeline[0];
            if (now - oldest.date >= expireTime) {
                removeOldest();
            } else {
                return;
            }
        }
    };

    let removeOldest = () => {
        let {
            key,
            size
        } = timeline.shift();
        delete map[key];
        sumCacheSize -= size;
    };

    return {
        setCache,
        getCache,
        clearExpires
    };
};

