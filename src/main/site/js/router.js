class Router {
  routes = [];

  mode = null;

  root = '/';
  
  current = null;

  constructor(options) {
    this.mode = window.history.pushState ? 'history' : 'hash';
    if (options.mode) this.mode = options.mode;
    if (options.root) this.root = options.root;
    this.listen();
  }

  add(path, cb) {
    this.routes.push({ path, cb });
    return this;
  }

  remove(path) {
    for (let i = 0; i < this.routes.length; i += 1) {
      if (this.routes[i].path === path) {
        this.routes.slice(i, 1);
        return this;
      }
    }
    return this;
  }

  flush() {
    this.routes = [];
    return this;
  }

  /**
   * @param {string} path
   * @return {string}
   */
  clearSlashes(path) {
    return path
      .toString()
      .replace(/\/$/, '')
      .replace(/^\//, '');
  }

  getFragment() {
	/** @type {string} */
    let fragment = '';
    if (this.mode === 'history') {
      fragment = this.clearSlashes(decodeURI(window.location.pathname + window.location.search));
      fragment = fragment.replace(/\?(.*)$/, '');
      fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;
    } else {
      const match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : '';
    }
    return this.clearSlashes(fragment);
  }

navigate(path = '', state = null) {
	if (this.mode === 'history') {
		window.history.pushState(state, '', this.root + this.clearSlashes(path));
	} else {
		var href = `${window.location.href.replace(/#(.*)$/, '')}#${path}`;
		if(state !== null) {
			var encstate = encodeURIComponent(state);
			href = href + `|${encstate}`;
		}
		window.location.href = href;
	}
    return this;
  }

  intervalId;
  
  listen() {
    window.clearInterval(this.intervalId);
    this.intervalId = window.setInterval(this.interval.bind(this), 50);
  }

  interval() {
    if (this.current === this.getFragment()) return;
    this.current = this.getFragment();

    this.routes.some(route => {
      const match = this.current.match(route.path);
      if (match) {
        match.shift();
        route.cb.apply({}, match);
        return match;
      }
      return false;
    });
  }
}

export { Router };
