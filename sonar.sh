#!/bin/bash
system=`uname`
if [ $system == Darwin ];then
    echo 'mac'
    name=`git rev-parse --abbrev-ref HEAD`
    echo $name
    sonar-scanner -Dsonar.branch.name=$name
else
    echo 'win'
    start .\\scanner.bat
fi