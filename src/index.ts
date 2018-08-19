import Interpreter from "./Interpreter";

const ref = `
Computer.DO.print "Fizz Buzz!"
Computer.DO.set $num 1
Computer.DO.loop 30 times
  Computer.DO.print $num
  Computer.DO.mod $num 3 to $mod3
  Computer.DO.mod $num 5 to $mod5
  Computer.DO.if $mod3 = 0
    Computer.DO.print "Divisible by 3!"
    Computer.DO.if $mod5 = 0
      Computer.DO.print "Divisible by 15!"
    Computer.DO.return
  Computer.DO.return
  Computer.DO.add $num 1 to $num
Computer.DO.return
`;

console.log(ref);
const interpreter = new Interpreter();
interpreter.run(ref);
