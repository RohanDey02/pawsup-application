/*
  This is where we implement the queries. Some queries include signup POST and signin POST. 
*/

const express = require('express');
const router = express.Router();

// MongoDB Models
const User = require('../models/User');
const Listing = require('./../models/Listing');

// Password Encrypter
const bcrypt = require('bcrypt');

// Signup
router.post('/signup', (req, res) => {
    let { email, password, fullname, dateofbirth, phonenumber, accounttype, pettype } = req.body;

    email = email.trim();
    password = password.trim();
    fullname = fullname.trim();
    dateofbirth = dateofbirth.trim();
    phonenumber = phonenumber.trim();
    accounttype = accounttype.trim();
    pettype = pettype.trim();

    if (email == "" || password == "" || fullname == "" || dateofbirth == "" || phonenumber == "" || accounttype == "" || pettype == "") {
        res.json({
            status: "FAILED",
            message: "Empty fields!"
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered",
        });
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short!",
        });
    } else if (!/^[a-zA-Z ]*$/.test(fullname)) {
        res.json({
            status: "FAILED",
            message: "Invalid name entered",
        });
    } else if (!new Date(dateofbirth).getTime()) {
        res.json({
            status: "FAILED",
            message: "Invalid date of birth entered",
        });
    } else if (!/^[\d]{10}$/.test(phonenumber)) {
        res.json({
            status: "FAILED",
            message: "Invalid phone number entered",
        });
    } else if (!(/^(Petowner|Petsitter)$/.test(accounttype))) {
        res.json({
            status: "FAILED",
            message: "Invalid account type entered",
        });
    } else if (!/^[a-zA-Z ]*$/.test(pettype)) {
        res.json({
            status: "FAILED",
            message: "Invalid pet type entered",
        });
    } else {
        // Check if User already exists
        User.find({ email }).then(result => {
            if (result.length) {
                // User exists
                res.json({
                    status: "FAILED",
                    message: "User already exists"
                })
            } else {
                // Create user

                // Password Handler
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        email,
                        password,
                        fullname,
                        dateofbirth,
                        phonenumber,
                        accounttype,
                        pettype
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "Signup Successful",
                            data: result,
                        })
                    }).catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "Error: Saving User"
                        })
                    })
                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "Error: Hashing password"
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Checking for existing user"
            })
        })
    }
});

// Signin
router.post('/signin', (req, res) => {
    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();

    if (email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Credentials"
        })
    } else {
        // Check if User exists
        User.find({email}).then(data => {
            if (data.length) {
                // User exists
                const hashedPassword = data[0].password;
                if(password == hashedPassword){
                    res.json({
                        status: "SUCCESS",
                        message: "Signin Successful",
                        data: data
                    })
                } else {
                    res.json({
                        status: "FAILED",
                        message: "Error: Invalid Password"
                    })
                }
            } else {
                res.json({
                    status: "FAILED",
                    message: "Error: Invalid Credentials"
                })
            }
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "Error: Checking for Existing User"
            })
        })
    }
});

// Update
router.put('/update', (req, res) => {
    let { email, password, pettype } = req.body;

    email = email.trim();
    password = password.trim();
    pettype = pettype.trim();

    if (email == "" || password == "" || pettype == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Credentials"
        })
    } else {
        var conditions = { email: email };

        // Updates user's password and/or found by email
        User.updateOne(conditions, req.body).then(doc => {
            if (!doc) {
                res.json({
                    status: "FAILED",
                    message: "Error could not find user"
                })
            } else {
                User.find(conditions).then(data =>
                    res.json({
                        status: "SUCCESS",
                        message: "Update Successful",
                        data: data
                    })
                )
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Checking for Existing User"
            })
        })
    }
});

// Create Listing
router.post('/createListing', (req, res) => {
    let { listingowner } = req.body;
    var emptyString = "Not Filled Out Yet";
    var emptyArray = [];

    listingowner = listingowner.trim();
    emptyString = emptyString.trim();

    if (listingowner == "") {
        res.json({
            status: "FAILED",
            message: "Empty field!"
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(listingowner)) {
        res.json({
            status: "FAILED",
            message: "Invalid listing owner entered",
        });
    } else {
        // Check if Listing already exists
        Listing.find({ listingowner }).then(result => {
            if (result.length) {
                // Listing exists
                res.json({
                    status: "FAILED",
                    message: "Listing already exists"
                })
            } else {
                // Create listing
                const newListing = new Listing({
                    listingowner: listingowner,
                    title: emptyString,
                    description: emptyString,
                    features: emptyString,
                    bookings: emptyArray
                });

                newListing.save().then(result => {
                    res.json({
                        status: "SUCCESS",
                        message: "Listing Creation Successful",
                        data: result,
                    })
                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "Error: Saving New Listing"
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Checking for existing listing"
            })
        })
    }
});

// Get Listing
router.get('/getListing', (req, res) => {
    let { listingowner } = req.body;

    listingowner = listingowner.trim();

    if (listingowner == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Listing Owner Field!"
        })
    } else {
        var query = { listingowner: listingowner };

        // Get listing data for bookings
        Listing.find(query).then(data => {
            res.json({
                status: "SUCCESS",
                message: "Listing Found Successfully",
                data: data
            })
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Finding Listing, Perhaps Doesn't Exist"
            })
        })
    }
});

// Modify Listing
router.put('/modifyListing', (req, res) => {
    let { listingowner, title, description, features } = req.body;

    listingowner = listingowner.trim();
    title = title.trim();
    description = description.trim();
    features = features.trim();

    if (listingowner == "" || title == "" || description == "" || features == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Listing Fields!"
        })
    } else {
        var query = { listingowner: listingowner };

        // Get listing data for bookings
        Listing.find(query).then(info => {
            req.body.bookings = info[0].bookings

            // Updates listing's information
            Listing.updateOne(query, req.body).then(doc => {
                if (!doc) {
                    res.json({
                        status: "FAILED",
                        message: "Error: Could Not Find Listing"
                    })
                } else {
                    Listing.find(query).then(data =>
                        res.json({
                            status: "SUCCESS",
                            message: "Listing Modification Successful",
                            data: data
                        })
                    )
                }
            }).catch(err => {
                console.log(err);
                res.json({
                    status: "FAILED",
                    message: "Error: Checking for Existing Listing #2"
                })
            })
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Checking for Existing Listing #1"
            })
        })
    }
});

// Make Booking
router.put('/makeBooking', (req, res) => {
    let { listingowner, reason, startdate, enddate } = req.body;

    listingowner = listingowner.trim();
    reason = reason.trim();
    startdate = startdate.trim();
    enddate = enddate.trim();

    // Converting to Date Format
    var s1 = startdate.split("/");
    var e1 = enddate.split("/");
    var startdate1 = new Date(s1[0], parseInt(s1[1])-1, s1[2]);
    var enddate1 = new Date(e1[0], parseInt(e1[1])-1, e1[2]);

    var booking = { reason: reason, startdate: startdate, enddate: enddate };

    if (listingowner == "" || reason == "" || startdate == "" || enddate == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Listing Fields!"
        })
    } else if(enddate1 < startdate1) {
        res.json({
            status: "FAILED",
            message: "Error: End Date is before Start Date"
        })
    } else {
        var query = { listingowner: listingowner };

        // Get Listing Data
        Listing.find(query).then(info => {
            if (info.length) {
                // User exists, now check if date is blocked
                var bool = false;
                
                // Iterate through all of the dates
                for(const booking of info[0].bookings) {
                    console.log(booking);
                    var d1 = booking.startdate.split("/");
                    var d2 = booking.enddate.split("/");

                    var from = new Date(d1[0], parseInt(d1[1])-1, d1[2]);  // -1 because months are from 0 to 11
                    var to = new Date(d2[0], parseInt(d2[1])-1, d2[2]);

                    // Check for overlapping
                    if((startdate1 >= from && startdate1 <= to) || (enddate1 >= from && enddate1 <= to) || (from >= startdate1 && from <= enddate1) || (to >= startdate1 && to <= enddate1)){
                        bool = true;
                        break;
                    }
                }
                
                if(bool == false){
                    info[0].bookings.push(booking);

                    // Updates listing's information
                    Listing.updateOne(query, info[0]).then(doc => {
                        if (!doc) {
                            res.json({
                                status: "FAILED",
                                message: "Error: Could Not Find Listing"
                            })
                        } else {
                            Listing.find(query).then(data =>
                                res.json({
                                    status: "SUCCESS",
                                    message: "Listing Booking Added Successfully",
                                    data: data
                                })
                            )
                        }
                    }).catch(err => {
                        console.log(err);
                        res.json({
                            status: "FAILED",
                            message: "Error: Checking for Existing Listing #2"
                        })
                    })
                } else {
                    res.json({
                        status: "FAILED",
                        message: "Error: Dates Are Blocked Off Or Already Taken"
                    })
                }
            } else {
                res.json({
                    status: "FAILED",
                    message: "Error: Invalid Credentials"
                })
            }
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "Error: Checking for Existing Listing #1"
            })
        })
    }
});

module.exports = router;