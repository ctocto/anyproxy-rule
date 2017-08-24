'use strict';
const fetch = require('node-fetch');//https://www.npmjs.com/package/node-fetch
const Scheme = require('./config');
module.exports = {

	summary: 'the deploy rule for AnyProxy',

	/**
	 * 
	 * 
	 * @param {object} requestDetail
	 * @param {string} requestDetail.protocol
	 * @param {object} requestDetail.requestOptions
	 * @param {object} requestDetail.requestData
	 * @param {object} requestDetail.response
	 * @param {number} requestDetail.response.statusCode
	 * @param {object} requestDetail.response.header
	 * @param {buffer} requestDetail.response.body
	 * @returns
	 */
	* beforeSendRequest(requestDetail) {
		if (Scheme.localResponse.url) {

			const localResponse = Scheme.localResponse.params;
			if (requestDetail.url.indexOf(Scheme.localResponse.url) === 0) {
				return {
					response: localResponse
				}
			}
		}
		if (Scheme.remotePath.url) {
			const newRequestOptions = Object.assign({}, requestDetail.requestOptions, Scheme.protocol.params);
			if (requestDetail.url.indexOf(Scheme.remotePath.url) === 0) {
				return {
					requestOptions: newRequestOptions
				}
			}
		}
		if (Scheme.protocol.url) {
			const newRequestOptions = Object.assign({}, requestDetail.requestOptions, Scheme.protocol.params);
			delete newRequestOptions.protocol;
			if (requestDetail.url.indexOf(Scheme.protocol.url) === 0) {
				return {
					protocol: Scheme.protocol.params.protocol,
					requestOptions: newRequestOptions
				}
			}
		}
		// if(Scheme.remoteUrl.url){
		//   const newRequestOptions = Object.assign({}, requestDetail.requestOptions, Scheme.remoteUrl.params);
		//   delete newRequestOptions.url;
		//   if(requestDetail.url.indexOf(Scheme.remoteUrl.url) === 0){
		//     return {
		//       url: Scheme.remoteUrl.params.url,
		//       requestOptions: newRequestOptions
		//     }
		//   }
		// }
		return null;
	},


	/**
	 * 
	 * 
	 * @param {object} requestDetail
	 * @param {object} responseDetail
	 */
	* beforeSendResponse(requestDetail, responseDetail) {
		console.log('参数：',requestDetail.requestData.toString('utf8', 0), requestDetail.requestData.length)
		if (Scheme.remoteUrl.url && requestDetail.url.indexOf(Scheme.remoteUrl.url) === 0) {
			console.log('成功拦截：',requestDetail.url);
			const newResponse = responseDetail.response;
			if (Scheme.remoteUrl.params.type === 'json' && Scheme.remoteUrl.params.methhod === 'POST') {
				return fetch(Scheme.remoteUrl.params.url, {
						method: Scheme.remoteUrl.params.methhod,
						headers: {//https://github.com/bitinn/node-fetch/issues/16#issuecomment-97489994
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
							'Content-Length': requestDetail.requestData.length
						},
						body: requestDetail.requestData.toString('utf8', 0)
					})
					.then((res) => {
						return res.json()
					})
					.then((data) => {

						newResponse.body = JSON.stringify(data);
						return {
							response: newResponse
						}
					})
					.catch(err => {
						console.log('错误：',err)
					});
			} else if (Scheme.remoteUrl.params.type === 'json') {
				return fetch(Scheme.remoteUrl.params.url + '?' + requestDetail.requestData.toString('utf8', 0), {
						method: Scheme.remoteUrl.params.methhod,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
							'Content-Length': requestDetail.requestData.length
						}
					})
					.then((res) => {
						return res.json()
					})
					.then((data) => {
						newResponse.body = JSON.stringify(data);
						return {
							response: newResponse
						}
					})
					.catch(err => {
						console.log('错误：',err)
					});
			} else {
				return fetch(Scheme.remoteUrl.params.url, {
						method: Scheme.remoteUrl.params.methhod
					})
					.then((res) => {

						switch (Scheme.remoteUrl.params.type) {
							case 'image':
								return res.buffer()//http://javascript.ruanyifeng.com/nodejs/buffer.html
							case 'js':
								return res.text()
						}
					})
					.then((data) => {
	
						newResponse.body = data;
						return {
							response: newResponse
						}
					})
					.catch(err => {
						console.log('错误：',err)
					});
			}

		}
	},


	/**
	 * 
	 * 
	 * @param {any} requestDetail 
	 * @returns 
	 */
	* beforeDealHttpsRequest(requestDetail) {
		return false;
	},

	/**
	 * 
	 * 
	 * @param {any} requestDetail 
	 * @param {any} error 
	 * @returns 
	 */
	* onError(requestDetail, error) {
		return null;
	},


	/**
	 * 
	 * 
	 * @param {any} requestDetail 
	 * @param {any} error 
	 * @returns 
	 */
	* onConnectError(requestDetail, error) {
		return null;
	},
};