"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const debounce_1 = require("debounce");
const mobx_1 = require("mobx");
const mobx_react_lite_1 = require("mobx-react-lite");
const react_1 = require("react");
class UserService {
    constructor() {
        this.loading = true;
        this.data = {
            user: null
        };
        this.setLoading = debounce_1.default(value => {
            this.loading = value;
        }, 50);
    }
    get user() {
        return this.data.user;
    }
    get isGuest() {
        return !this.data.user && !this.loading;
    }
    useUserChange(callback) {
        mobx_react_lite_1.useDisposable(() => mobx_1.reaction(() => this.data.user, callback));
    }
    useHook() {
        react_1.useEffect(() => this.checkAuth(), []);
    }
    checkAuth() {
        this.setLoading(true);
        this.data.user = {
            id: -1,
            email: 'user@mail.com'
        };
        this.setLoading(false);
    }
}
__decorate([
    mobx_1.observable,
    __metadata("design:type", Object)
], UserService.prototype, "loading", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", Object)
], UserService.prototype, "data", void 0);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], UserService.prototype, "user", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], UserService.prototype, "isGuest", null);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map