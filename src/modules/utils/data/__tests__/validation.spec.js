import { isRequired, isLongerThan, isValidWebURL } from '../validation';

describe('isRequired', () => {
    it('should fail for empty values', () => {
        expect(isRequired('')).toBeFalsy();
        expect(isRequired(null)).toBeFalsy();
        expect(isRequired(undefined)).toBeFalsy();
    });

    it('should pass for any non empty value', () => {
        expect(isRequired('A')).toBeTruthy();
        expect(isRequired('1')).toBeTruthy();
        expect(isRequired('Something else')).toBeTruthy();
    });
});

describe('isLongerThan', () => {
    it('should pass for empty values', () => {
        expect(isLongerThan('', 5)).toBeTruthy();
        expect(isLongerThan(null, 5)).toBeTruthy();
        expect(isLongerThan(undefined, 5)).toBeTruthy();
    });

    it('should fail for values shorter or equal to the given length', () => {
        expect(isLongerThan(' ', 5)).toBeFalsy();
        expect(isLongerThan('  ', 5)).toBeFalsy();
        expect(isLongerThan('   ', 5)).toBeFalsy();
        expect(isLongerThan('    ', 5)).toBeFalsy();
        expect(isLongerThan('     ', 5)).toBeFalsy();
        expect(isLongerThan('A', 5)).toBeFalsy();
        expect(isLongerThan('AB', 5)).toBeFalsy();
        expect(isLongerThan('ABC', 5)).toBeFalsy();
        expect(isLongerThan('ABCD', 5)).toBeFalsy();
        expect(isLongerThan('ACBDE', 5)).toBeFalsy();
    });

    it('should pass for values longer than the given length', () => {
        expect(isLongerThan('      ', 5)).toBeTruthy();
        expect(isLongerThan('123456', 5)).toBeTruthy();
        expect(isLongerThan('ABCDEF', 5)).toBeTruthy();
    });
});

describe('isValidWebURL', () => {
    it('should pass for empty values', () => {
        expect(isValidWebURL('')).toBeTruthy();
        expect(isValidWebURL(null)).toBeTruthy();
        expect(isValidWebURL(undefined)).toBeTruthy();
    });

    it('should validate valid URLs', () => {
        expect(isValidWebURL('http://foo.com/blah_blah')).toBeTruthy();
        expect(isValidWebURL('http://foo.com/blah_blah/')).toBeTruthy();
        expect(
            isValidWebURL('http://foo.com/blah_blah_(wikipedia)')
        ).toBeTruthy();
        expect(
            isValidWebURL('http://foo.com/blah_blah_(wikipedia)_(again)')
        ).toBeTruthy();
        expect(
            isValidWebURL('http://www.example.com/wpstyle/?p=364')
        ).toBeTruthy();
        expect(
            isValidWebURL('https://www.example.com/foo/?bar=baz&inga=42&quux')
        ).toBeTruthy();
        expect(isValidWebURL('http://✪df.ws/123')).toBeTruthy();
        expect(
            isValidWebURL('http://userid:password@example.com:8080')
        ).toBeTruthy();
        expect(
            isValidWebURL('http://userid:password@example.com:8080/')
        ).toBeTruthy();
        expect(isValidWebURL('http://userid@example.com')).toBeTruthy();
        expect(isValidWebURL('http://userid@example.com/')).toBeTruthy();
        expect(isValidWebURL('http://userid@example.com:8080')).toBeTruthy();
        expect(isValidWebURL('http://userid@example.com:8080/')).toBeTruthy();
        expect(
            isValidWebURL('http://userid:password@example.com')
        ).toBeTruthy();
        expect(
            isValidWebURL('http://userid:password@example.com/')
        ).toBeTruthy();
        expect(isValidWebURL('http://142.42.1.1/')).toBeTruthy();
        expect(isValidWebURL('http://142.42.1.1:8080/')).toBeTruthy();
        expect(isValidWebURL('http://➡.ws/䨹')).toBeTruthy();
        expect(isValidWebURL('http://⌘.ws')).toBeTruthy();
        expect(isValidWebURL('http://⌘.ws/')).toBeTruthy();
        expect(
            isValidWebURL('http://foo.com/blah_(wikipedia)#cite-1')
        ).toBeTruthy();
        expect(
            isValidWebURL('http://foo.com/blah_(wikipedia)_blah#cite-1')
        ).toBeTruthy();
        expect(
            isValidWebURL('http://foo.com/unicode_(✪)_in_parens')
        ).toBeTruthy();
        expect(
            isValidWebURL('http://foo.com/(something)?after=parens')
        ).toBeTruthy();
        expect(isValidWebURL('http://☺.damowmow.com/')).toBeTruthy();
        expect(
            isValidWebURL('http://code.google.com/events/#&product=browser')
        ).toBeTruthy();
        expect(isValidWebURL('http://j.mp')).toBeTruthy();
        expect(isValidWebURL('ftp://foo.bar/baz')).toBeTruthy();
        expect(
            isValidWebURL('http://foo.bar/?q=Test%20URL-encoded%20stuff')
        ).toBeTruthy();
        expect(isValidWebURL('http://مثال.إختبار')).toBeTruthy();
        expect(isValidWebURL('http://例子.测试')).toBeTruthy();
        expect(isValidWebURL('http://उदाहरण.परीक्षा')).toBeTruthy();
        expect(
            isValidWebURL("http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com")
        ).toBeTruthy();
        expect(isValidWebURL('http://1337.net')).toBeTruthy();
        expect(isValidWebURL('http://a.b-c.de')).toBeTruthy();
        expect(isValidWebURL('http://223.255.255.254')).toBeTruthy();
    });

    it('should error invalid URLs', () => {
        expect(isValidWebURL('http://')).toBeFalsy();
        expect(isValidWebURL('http://.')).toBeFalsy();
        expect(isValidWebURL('http://..')).toBeFalsy();
        expect(isValidWebURL('http://../')).toBeFalsy();
        expect(isValidWebURL('http://?')).toBeFalsy();
        expect(isValidWebURL('http://??')).toBeFalsy();
        expect(isValidWebURL('http://??/')).toBeFalsy();
        expect(isValidWebURL('http://#')).toBeFalsy();
        expect(isValidWebURL('http://##')).toBeFalsy();
        expect(isValidWebURL('http://##/')).toBeFalsy();
        expect(
            isValidWebURL('http://foo.bar?q=Spaces should be encoded')
        ).toBeFalsy();
        expect(isValidWebURL('//')).toBeFalsy();
        expect(isValidWebURL('//a')).toBeFalsy();
        expect(isValidWebURL('///a')).toBeFalsy();
        expect(isValidWebURL('///')).toBeFalsy();
        expect(isValidWebURL('http:///a')).toBeFalsy();
        expect(isValidWebURL('foo.com')).toBeFalsy();
        expect(isValidWebURL('rdar://1234')).toBeFalsy();
        expect(isValidWebURL('h://test')).toBeFalsy();
        expect(isValidWebURL('http:// shouldfail.com')).toBeFalsy();
        expect(isValidWebURL(':// should fail')).toBeFalsy();
        expect(isValidWebURL('http://foo.bar/foo(bar)baz quux')).toBeFalsy();
        expect(isValidWebURL('ftps://foo.bar/')).toBeFalsy();
        expect(isValidWebURL('http://-error-.invalid/')).toBeFalsy();
        expect(isValidWebURL('http://-a.b.co')).toBeFalsy();
        expect(isValidWebURL('http://a.b-.co')).toBeFalsy();
        expect(isValidWebURL('http://0.0.0.0')).toBeFalsy();
        expect(isValidWebURL('http://10.1.1.0')).toBeFalsy();
        expect(isValidWebURL('http://10.1.1.255')).toBeFalsy();
        expect(isValidWebURL('http://224.1.1.1')).toBeFalsy();
        expect(isValidWebURL('http://1.1.1.1.1')).toBeFalsy();
        expect(isValidWebURL('http://123.123.123')).toBeFalsy();
        expect(isValidWebURL('http://3628126748')).toBeFalsy();
        expect(isValidWebURL('http://.www.foo.bar/')).toBeFalsy();
        expect(isValidWebURL('http://.www.foo.bar./')).toBeFalsy();
        expect(isValidWebURL('http://10.1.1.1')).toBeFalsy();
    });
});
