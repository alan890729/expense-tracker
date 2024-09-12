module.exports = {
    bottomThresholdPageNum: 5, // a property for changing page button display, implicitly used

    // limit will be set to 10 if not mentioned, meaning 10 records per page.
    getTotalPage(amountOfRecords, limit = 10) {
        return amountOfRecords % limit ? Math.ceil(amountOfRecords / limit) : amountOfRecords / limit
    },

    getPreviousPage(currentPage) {
        return currentPage - 1 ? currentPage - 1 : currentPage
    },

    getNextPage(currentPage, totalPage) {
        return currentPage + 1 > totalPage ? currentPage : currentPage + 1
    },

    getPageBtnArr(currentPage, totalPage) {
        let pageBtnArr = []
        if (totalPage < 10) {
            return pageBtnArr = Array.from({ length: totalPage }).map((_, i) => {
                return {
                    pageNum: i + 1
                }
            })
        }

        const upperThresholdPageNum = totalPage - 3

        switch (true) {
            case currentPage < this.bottomThresholdPageNum:
                console.log('currentPage:', currentPage)
                console.log(`1 2 3 4 5 ... ${totalPage}`)
                pageBtnArr = Array.from({ length: 5 }).map((_, i) => {
                    return {
                        pageNum: i + 1
                    }
                })
                pageBtnArr.push(
                    {
                        pageNum: '...',
                        isDisabled: true
                    },
                    {
                        pageNum: totalPage
                    }
                )
                break
            case currentPage >= this.bottomThresholdPageNum && currentPage < upperThresholdPageNum:
                console.log('currentPage:', currentPage)
                console.log(`1 ... ${currentPage - 1} ${currentPage} ${currentPage + 1} ... ${totalPage}`)
                pageBtnArr.push(
                    {
                        pageNum: 1
                    },
                    {
                        pageNum: '...',
                        isDisabled: true
                    },
                    {
                        pageNum: currentPage - 1
                    },
                    {
                        pageNum: currentPage
                    },
                    {
                        pageNum: currentPage + 1
                    },
                    {
                        pageNum: '...',
                        isDisabled: true
                    },
                    {
                        pageNum: totalPage
                    }
                )
                break
            case currentPage >= upperThresholdPageNum:
                console.log('currentPage:', currentPage)
                console.log(`1 ... ${totalPage - 4} ${totalPage - 3} ${totalPage - 2} ${totalPage - 1} ${totalPage}`)
                pageBtnArr = Array.from({ length: 5 }).map((_, i) => {
                    return {
                        pageNum: totalPage - (4 - i)
                    }
                })
                pageBtnArr.unshift(
                    {
                        pageNum: 1
                    },
                    {
                        pageNum: '...',
                        isDisabled: true
                    }
                )
                break
        }

        return pageBtnArr
    },

    generatePaginatorForRender(httpResponse, amountOfRecords, currentPage, limit = 10) {
        const totalPage = this.getTotalPage(amountOfRecords, limit)
        const prevPage = this.getPreviousPage(currentPage)
        const nextPage = this.getNextPage(currentPage, totalPage)
        const pageBtnArr = this.getPageBtnArr(currentPage, totalPage)
        pageBtnArr.forEach(pageBtn => {
            if (pageBtn.pageNum === currentPage) {
                pageBtn.isActive = true
            }
        })
        httpResponse.locals.prevPage = prevPage
        httpResponse.locals.nextPage = nextPage
        httpResponse.locals.pageBtnArr = pageBtnArr
    }
}