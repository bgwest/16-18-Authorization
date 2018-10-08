#!/bin/bash
# used for testing http server - saves on the complex cli testing headaches
# avoids long messy copy/pastes
# bgw 10/2018

# shout out to https://devhints.io/httpie for this awesome httpie cheat sheet

# http POST http://example.com/posts/3 \
#    Origin:example.com \  # :   HTTP headers
#    name="John Doe" \     # =   string
#    q=="search" \         # ==  URL parameters (?q=search)
#    age:=29 \             # :=  for non-strings
#    list:='[1,3,4]' \     # :=  json
#    file@file.bin \       # @   attach file
#    token=@token.txt \    # =@  read from file (text)
#    user:=@user.json      # :=@ read from file (json)

# NOTE... token is added via source into bash env (see README.md)

# upload an image
[[ $1 == "upload" ]] &&
http -f --headers POST localhost:3000/image/upload "Authorization:Bearer $token" title="bread?" bread@./src/__test__/assets/product-classic-white.png

# delete an image
[[ $1 == "delete" ]] &&
http --headers DELETE localhost:3000/image/upload/$2 "Authorization:Bearer $token"

# catch case
[[ -z $(echo $1) ]] &&
echo -e "\nNothing passed, nothing gained.\n"
