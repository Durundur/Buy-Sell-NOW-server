const mongoose = require('mongoose')

const AdSchema = mongoose.Schema({
    tittle: {
        type: String,
        required: true
    },
    price: {
        value: {
            type: String,
        },
        isNegotiable: {
            type: Boolean
        },
        adType: {
            type: String,
            enum: {
                values: ['sprzedaż', 'zamiana', 'za darmo']
            }
        },
    },
    description: {
        type: String,
        required: true
    },
    noOfviews: {
        type: Number
    },
    advertiser: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'UsersData'},
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        }
    },
    address: {
        state: {
            type: String
        },
        county: {
            type: String
        },
        city: {
            type: String
        },
        lat:{
            type: String
        },
        lon: {
            type: String
        }
    },
    images: [{
        type: String
    }],
    mainCategory: {
        type: String,
        enum: {
            values: ['motoryzacja', 'nieruchomości', 'praca', 'antyki i kolekcje', 'budowlane', 'dom i ogród', 'elektronika', 'moda', 'rolnictwo', 'zwierzęta', 'sport i hobby', 'dla dzieci', 'edukacja', 'usługi'],
        },
    },
    subCategory: {
        type: String,
        enum: {
            values: ['samochody osobowe', 'motocykle i skutery', 'dostawcze', 'ciężarowe', 'budowlane', 'przyczepy i naczepy', 'części', 'opony i felgi', 'pozostałe w motoryzacja', 'mieszkania', 'domy', 'działki', 'biura i lokale', 'garaże i parkingi', 'stancje i pokoje', 'hale i magazyny', 'pozostałe nieruchomości', 'administracja biurowa', 'budowa, remonty', 'dostawca, kurier miejski', 'handel internetowy', 'finanse, księgowość', 'fryzjerstwo, kosmetyka', 'gastronomia', 'HR', 'IT', 'kierowca', 'logistyka, spedycja', 'mechanika', 'praca za granicą', 'pracownik sklepu', 'produkcja', 'pozostałe w praca', 'antyki', 'kolekcje', 'sztuka', 'rękodzieło', 'budowa', 'instalacje', 'meble', 'ogród', 'narzędzia', 'ogrzewanie', 'oświetlenie', 'wykończenie wnętrz', 'pozostałe w dom i ogród', 'fotografia', 'gry i konsole', 'komputery', 'smartwatche i opaski', 'sprzęt AGD', 'sprzęt audio', 'telefony', 'telewizory', 'pozostałe w elektronika', 'ubrania damskie', 'ubrania męskie', 'ubrania damskie',
                'ubrania męskie',
                'ubrania dziecięce',
                'akcesoria',
                'biżuteria',
                'buty',
                'pozostałe w moda',
                'ciągniki',
                'maszyny rolnicze',
                'przyczepy',
                'opony',
                'zwierzęta',
                'pozostałe w rolnictwo',
                'karma i przysmaki',
                'psy',
                'koty',
                'ptaki',
                'gryzonie i króliki',
                'pozostałe w zwierzęta',
                'akcesoria dla niemowląt',
                'buciki',
                'foteliki i nosidełka',
                'meble dla dzieci',
                'odzież niemowlęca',
                'wózki dziecięce',
                'zabawki',
                'pozostałe w dla dzieci',
                'gry planszowe',
                'fitness',
                'rowery',
                'skating',
                'sporty wodne',
                'sporty zimowe',
                'wędkarstwo',
                'pozostałe w sport i hobby',
                'książki',
                'muzyka',
                'filmy',
                'pozostałe w edukacja',
                'budowa i remont',
                'obsługa imprez',
                'sprzątanie',
                'tłumaczenia',
                'usługi informatyczne',
                'usługi motoryzacyjne',
                'korepetycje',
                'serwis i naprawa',
                'wyposażenie firm',
                'pozostałe w usługi',
				'usługi'],
        },
    },
    subSubCategory: {
        type: String,
    },

    details: {
        brand: {
            type: String,
        },
        model: {
            type: String,
        },
        vinNumber: {
            type: String,
        },
        engineSize: {
            type: Number,
        },
        productionYear: {
            type: String,
        },
        enginePower: {
            type: Number,
        },
        fuel: {
            type: String,
            enum: {
                values: ['diesel', 'benzyna', 'lpg', 'elektryczny', 'hybryda'],
            }
        },
        bodyType: {
            type: String,
            enum: {
                values: ['sedan', 'coupe', 'hatchback', 'suv', 'kabriolet', 'limuzyna', 'minivan', 'kombi', 'pickup'],
            }
        },
        mileage: {
            type: String,
        },
        color: {
            type: String,
        },
        condition: {
            type: String,
            enum: {
                values: ['uszkodzony', 'nieuszkodzony', 'nowy', 'używany'],
            },
        },
        transmission: {
            type: String,
            enum: {
                values: ['manualna', 'automatyczna'],
            },
        },
        driveType: {
            type: String,
            enum: {
                values: ['4x4', 'przód', 'tył'],
            },
        },
        // realestate
        level: {
            type: String,
            enum: {
                values: ['parter', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'powyżej 10', 'poddasze'],
            },
        },
        isFurnished: {
            type: Boolean,
        },
        buildingType: {
            type: String,
            enum: {
                values: ['blok', 'kamienica', 'apartamentowiec', 'pozostałe', 'wolnostojący', 'bliźniak', 'szeregowiec', 'gospodarstwo', 'pozostałe'],
            },
        },
        livingArea: {
            type: Number,
        },
        plotArea: {
            type: Number,
        },
        numberOfRooms: {
            type: String,
            enum: {
                values: ['1', '2', '3', '4 i więcej'],
            },
        },
        numberOfFloors: {
            type: String,
            enum: {
                values: ['parterowy', 'jednopiętrowy', 'dwupiętrowy i więciej'],
            },
        },
        rent: {
            value: {
                type: Number,
            },
        },
        typeOfPlot: {
            type: String,
            enum: {
                values: ['rekreacyjne', 'budowlane', 'rolne', 'leśne', 'ogródek działkowy']
            }
        },
        size: {
            type: String
        },
    }
}, { timestamps: true, toJSON: {virtuals: true}, id: false})


AdSchema.virtual('advertiser.details', {
    ref: 'UsersData', 
    localField: 'advertiser._id', // The field in the current model
    foreignField: '_id', // The field in the referenced model
    justOne: true, // Set this to true if you expect only one result
  });

module.exports = AdModel = mongoose.model('AdsData', AdSchema, 'AdsData')