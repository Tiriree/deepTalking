import sys
import pronouncing
import random

word_to_rhyme=sys.argv[1]
num_of_returns=int(sys.argv[2])

words_return=[]
rhymes=pronouncing.rhymes(word_to_rhyme.lower())
# print (word_to_rhyme+" rhymes with: ")
# print(rhymes)
if(len(rhymes)>0):
    if(num_of_returns>0):
        for x in range(0, num_of_returns):
            words_return.append(str(random.choice(rhymes)))
    else:
        for rhyme in rhymes:
            if'\'' not in rhyme:
                words_return.append(str(rhyme))
    random.shuffle(words_return)
    print(words_return)
    sys.stdout.flush()
else:
    print('no match found')
