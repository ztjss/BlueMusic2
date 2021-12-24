export function debounce(callback, time) {
    // 定时器
    let timer = null;
    // 返回一个函数
    return function(e) {
        // 1 在一定时间内再次触发事件说明已经存在一个定时器在工作，清空当前工作的定时器。
        // 2 但是如果定时器的回调已经执行过了，再次触发事件时定时器变量不为空
        // 而是上一次定时器执行结束的值，所以还会执行下面代码，但是这是无用的，需要在定时器里的回调执行结束后把定时器变量设为null
        if (timer !== null) {
            // 清空定时器
            clearTimeout(timer);
        }
        // 启动定时器
        timer = setTimeout(() => {
            // 执行回调
            callback.call(this, e);
            // 重置定时器变量为null
            timer = null;
        }, time);
    };
}