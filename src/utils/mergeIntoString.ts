const mergeIntoString = (inputString: string, mergeCodesObj: Object): string => {
    let result = inputString;
    
    for (const [code, replacement] of Object.entries(mergeCodesObj)) {
      const regex = new RegExp(`{{${code}}}`, 'g');
      result = result.replace(regex, replacement);
    }
    
    return result;
}

export default mergeIntoString;