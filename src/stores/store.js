import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        count: 0,
        isSeparateMailingAddress: false,
        address: {
            resident: {
                zone: '',
                district: '',
                subDistrict: '',
                street: '',
                village: '',
                estate: '',
                block: '',
                floor: '',
                flat: ''
            },
            mailing: {
                zone: '',
                district: '',
                subDistrict: '',
                street: '',
                village: '',
                estate: '',
                block: '',
                floor: '',
                flat: ''
            }
        }
    },
    getters: {
        // ...
        getAddressByTypeAndKey: (state) => (addressType, key) => {
            return state.address[addressType][key]
        }
    },
    mutations: {
        increment(state) {
            state.count++
        },
        resetPatientForm(state) {
            state.patientForm = {
                documentNo: ''
            }
        },
        updateIsSeparateMailingAddress(state, value) {
            state.isSeparateMailingAddress = value
        },
        updateAddressByTypeAndKeyValue(state, addressType, key, value) {
            console.log(`addressType: ${addressType} - key: ${key} - value: ${value}`)
            state.address[addressType][key] = value
            console.log(state.address[addressType][key])
            if (addressType === 'resident' &&
                !state.isSeparateMailingAddress) {
                state.address.mailing[key] = value
            }
        },

        updateResidentdistrict(state, value) {
            state.address.resident.district = value
            if (!state.isSeparateMailingAddress) {
                state.address.mailing.district = value
            }
        },
        updateResidentsubDistrict(state, value) {
            state.address.resident.subDistrict = value
            if (!state.isSeparateMailingAddress) {
                state.address.mailing.subDistrict = value
            }
        },
        updateResidentstreet(state, value) {
            state.address.resident.street = value
            if (!state.isSeparateMailingAddress) {
                state.address.mailing.street = value
            }
        },
        updateResidentvillage(state, value) {
            state.address.resident.village = value
            if (!state.isSeparateMailingAddress) {
                state.address.mailing.village = value
            }
        },
        updateResidentestate(state, value) {
            state.address.resident.state = value
            if (!state.isSeparateMailingAddress) {
                state.address.mailing.state = value
            }
        },
        updateResidentblock(state, value) {
            state.address.resident.block = value
            if (!state.isSeparateMailingAddress) {
                state.address.mailing.block = value
            }
        },
        updateResidentfloor(state, value) {
            state.address.resident.floor = value
            if (!state.isSeparateMailingAddress) {
                state.address.mailing.floor = value
            }
        },
        updateResidentflat(state, value) {
            state.address.resident.flat = value
            if (!state.isSeparateMailingAddress) {
                state.address.mailing.flat = value
            }
        }
    }
})
