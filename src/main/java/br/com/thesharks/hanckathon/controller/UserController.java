package br.com.thesharks.hanckathon.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import br.com.thesharks.hanckathon.persist.entity.User;
import br.com.thesharks.hanckathon.persist.repository.UserRepo;

@RestController
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepo userRepo;

    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public @ResponseBody List<User> usersList() {
        logger.debug("get users list");
        return userRepo.findAll();
    }

    @RequestMapping(value = "/users/{userId}", method = RequestMethod.GET)
    public @ResponseBody User getUser(@PathVariable Long userId) {
        logger.debug("get user");
        return userRepo.findOne(userId);
    }

    @RequestMapping(value = "/users", method = RequestMethod.POST)
    public @ResponseBody User saveUser(@RequestBody User user) {
        logger.debug("save user");
        userRepo.save(user);
        return user;
    }


}


