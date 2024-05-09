#!/usr/bin/env bash
# $1 is the input file path in s3
# $2 is the input text to be appended
# $3 is the id
# $4 is the table name
# echo $1 $2 $3 $4 > /tmp/vpcScript.log
LOCAL_PATH=/tmp/inputFile.txt
# copy the file from s3 to /tmp
aws s3 cp s3://$1 $LOCAL_PATH
echo "$2" >> $LOCAL_PATH
# copy the file back to s3 as output
aws s3 cp $LOCAL_PATH s3://$1.output

# add new line in database
aws dynamodb put-item --table-name $4 --item "{
    \"id\": {\"S\": \"$3\"},
    \"input_file_path\": {\"S\": \"$1\"},
    \"input_text\": {\"S\": \"$2\"},
    \"output_file_path\": {\"S\": \"$1.output\"}
}"

sudo shutdown -h now 