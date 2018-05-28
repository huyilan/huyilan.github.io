"use strict";

var LuckyFlower = function () {
    LocalContractStorage.defineProperty(this, "Owner");
    LocalContractStorage.defineProperty(this, "Count", {
        stringify: function (obj) {
            return obj.toString();
        },
        parse: function (str) {
            return parseInt(str);
        }
    });
    LocalContractStorage.defineProperty(this, "IndexCount", {
        stringify: function (obj) {
            return obj.toString();
        },
        parse: function (str) {
            return parseInt(str);
        }
    });
    LocalContractStorage.defineMapProperty(this, "Today", {
        stringify: function (obj) {
            return JSON.stringify(obj);
        },
        parse: function (str) {
            return JSON.parse(str);
        }
    });
};

LuckyFlower.prototype = {
    init: function () {
        this.Owner = Blockchain.transaction.from;
        this.Count = 0;
        this.IndexCount = 31;
    },
    _isOwner: function () {
        return this.Owner === Blockchain.transaction.from ? true : false;
    },
    transfer: function (address, value) {
        if (this._isOwner()) {
            Blockchain.transfer(address, value);
        } else {
            throw new Error("only owner invoke")
        }
    },
    setIndexCount(number) {
        if (this._isOwner()) {
            this.IndexCount = number;
        } else {
            throw new Error("only owner invoke")
        }
    },
    getLuckyFlower: function () {
        var yourLuckyFlower = this.Today.get(Blockchain.transaction.from)
        if (yourLuckyFlower) {
            if (new BigNumber(yourLuckyFlower.date).plus(1000 * 60 * 60 * 24).lte(new BigNumber(Date.now()))) {
                return this._write()
            } else {
                return {
                    status: -1,
                    from: Blockchain.transaction.from
                }
            }
        } else {
            return this._write();
        }
        this.Count += 1;


    },
    _write: function () {
        var _random = parseInt(Math.random() * this.IndexCount);
        this.Today.put(Blockchain.transaction.from, {
            date: Date.now(),
            random: _random,
            from: Blockchain.transaction.from
        })

        return {
            status: 0,
            random: _random,
            from: Blockchain.transaction.from
        }
    },
    getYours() {
        var yourLuckyFlower = this.Today.get(Blockchain.transaction.from);
        if (yourLuckyFlower) {
            if (new BigNumber(yourLuckyFlower.date).plus(1000 * 60 * 60 * 24).lte(new BigNumber(Date.now()))) {

            } else {
                return {
                    status: 0,
                    random: yourLuckyFlower.random,
                    from: Blockchain.transaction.from
                }
            }
        } else {
            return {
                status: -2,
                from: Blockchain.transaction.from
            }
        }
    },
    getCount: function () {
        return this.Count;
    }
}
module.exports = LuckyFlower;