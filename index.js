const appmetrics = require('appmetrics');
const statsD = require('hot-shots');

import BaseMonitoringService from '@thzero/library_server/service/baseMonitoring';

export default class AppMetricsPushMonitorService extends BaseMonitoringService {
	constructor() {
		super();

		this._client = null;
		this._monitor = null;
	}

	async init(injector) {
		super.init(injector);

		this._initialize();
	}

	_initialize() {
		this._monitor = appmetrics.monitor({
			mqtt: false
		});

		this._client  = new statsD({
			errorHandler: function (error) {
			  this._logger.error('Appmetrics - Socket errors caught', error);
			}
		});

		statsD.apply(this._client , {
			prefix: '' // TODO: config
		});

		this._initializeMonitors();
	}

	check(name, status, options, tags, callback) {
		this._client.check(name, status, options, tags, callback);
	}

	decrement(stat, value, sampleRate, tags, callback) {
		this._client.decrement(stat, value, sampleRate, tags, callback);
	}

	distribution(stat, value, sampleRate, tags, callback) {
		this._client.distribution(stat, value, sampleRate, tags, callback);
	}

	event(title, text, options, tags, callback) {
		this._client.event(title, text, options, tags, callback);
	}

	gauge(stat, value, sampleRate, tags, callback) {
		this._client.gauge(stat, value, sampleRate, tags, callback);
	}

	histogram(stat, value, sampleRate, tags, callback) {
		this._client.histogram(stat, value, sampleRate, tags, callback);
	}

	increment(stat, value, sampleRate, tags, callback) {
		this._client.increment(stat, value, sampleRate, tags, callback);
	}

	set(stat, value, sampleRate, tags, callback) {
		this._client.set(stat, value, sampleRate, tags, callback);
	}

	unique(stat, value, sampleRate, tags, callback) {
		this._client.unique(stat, value, sampleRate, tags, callback);
	}

	_initializeMonitors() {
		// const self = this;
		// this._monitor.on('initialized', function (env) {
		//	const menv = self._monitor.getEnvironment();
		//	for (var entry in menv) {
		//		console.log(entry + ':' + menv[entry]);
		//	};
		// });

		const self = this;

		this._monitor.on('cpu', function handleCPU(cpu) {
			// client.gauge('cpu.process', cpu.process);
			// client.gauge('cpu.system', cpu.system);
			self._handleCpu(cpu.process, cpu.system);
		});

		this._monitor.on('eventloop', function handleEL(eventloop) {
			// client.gauge('eventloop.latency.min', eventloop.latency.min);
			// client.gauge('eventloop.latency.max', eventloop.latency.max);
			// client.gauge('eventloop.latency.avg', eventloop.latency.avg);
			self._handleEventLoop(eventloop.latency.min, eventloop.latency.max, eventloop.latency.avg);
		});

		this._monitor.on('gc', function handleGC(gc) {
			// client.gauge('gc.size', gc.size);
			// client.gauge('gc.used', gc.used);
			// client.timing('gc.duration', gc.duration);
			self._handleGC(gc.size, gc.used, gc.duration);
		});

		this._monitor.on('memory', function handleMem(memory) {
			// client.gauge('memory.process.private', memory.private);
			// client.gauge('memory.process.physical', memory.physical);
			// client.gauge('memory.process.virtual', memory.virtual);
			// client.gauge('memory.system.used', memory.physical_used);
			// client.gauge('memory.system.total', memory.physical_total);
			self._handleMemory(memory.private, memory.physical, memory.virtual, memory.physical_used, memory.physical_total);
		});

		// this._monitor.on('http', function handleHTTP(http) {
		// 	client.timing('http', http.duration)
		// });

		// this._monitor.on('socketio', function handleSocketio(socketio) {
		// 	client.timing('socketio.' + socketio.method + '.' + socketio.event, socketio.duration)
		// });

		// this._monitor.on('mysql', function handleMySQL(mysql) {
		// 	client.timing('mysql', mysql.duration)
		// });

		// this._monitor.on('mongo', function handleMongo(mongo) {
		// 	client.timing('mongo', mongo.duration)
		// });

		// this._monitor.on('leveldown', function handleLeveldown(leveldown) {
		// 	client.timing('leveldown', leveldown.duration)
		// });

		// this._monitor.on('redis', function handleRedis(redis) {
		// 	client.timing('redis.' + redis.cmd, redis.duration)
		// });

		// this._monitor.on('memcached', function handleMemcached(memcached) {
		// 	client.timing('memcached.' + memcached.method, memcached.duration)
		// });

		// this._monitor.on('postgres', function handlePostgres(postgres) {
		// 	client.timing('postgres', postgres.duration)
		// });

		// this._monitor.on('mqtt', function handleMQTT(mqtt) {
		// 	client.timing('mqtt.' + mqtt.method + '.' + mqtt.topic, mqtt.duration)
		// });

		// this._monitor.on('mqlight', function handleMQLight(mqlight) {
		// 	client.timing('mqlight.' + mqlight.method + '.' + mqlight.topic, mqlight.duration)
		// });
	}
}
